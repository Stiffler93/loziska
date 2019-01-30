import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';

@Component({
  selector: 'app-our-stock', templateUrl: './our-stock.component.html', styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit {

  availableProducts: Product[] = [];
  selectedProduct: Product = new Product('', '', '', '');
  searchBar = {
    value: '',
    focused: false,
    hovered: false
  };

  public gridOptions: GridOptions = {
    enableColResize: true, enableSorting: true, onModelUpdated: () => {
      console.log('grid model updated');
      this.gridOptions.columnApi.autoSizeAllColumns();
    }
  };

  constructor(private data: DataService, private configuration: ConfigurationService) {
  }

  ngOnInit() {
    this.configuration.getConfigWithObservables('products').subscribe((value: string[]) => {
      this.parseProducts(value, this.availableProducts);
      this.changeProduct(this.availableProducts[0]);
    });
  }

  private parseProducts(data: string[], target: Product[]): void {
    data.forEach(product => {
      const p: Product = new Product(product['name'], product['file'], product['icon'], product['text']);
      if (product['parameters']) {
        this.parseParameters(product['parameters'], p.parameters);
      }
      if (product['products']) {
        if (!p.subproducts) {
          p.subproducts = [];
        }
        this.parseProducts(product['products'], p.subproducts);
      }
      target.push(p);
    });
  }

  private parseParameters(data: string[], target: string[]): void {
    data.forEach(parameter => {
      target.push(parameter);
    });
  }

  public changeProduct(product: Product): void {
    console.log({'new Product:': product});
    this.selectedProduct = product;

    if (!this.selectedProduct.gridData) {
      this.data.getData(product).subscribe(value => {
        this.selectedProduct = product;
      });
    }
  }

  public isCollapsed(product: Product): boolean {
    if (product.subproducts && product.subproducts.indexOf(this.selectedProduct) !== -1) {
      return false;
    }
    return this.selectedProduct.name !== product.name;
  }

  public filter(): void {
    this.gridOptions.api.setQuickFilter(this.searchBar.value);
  }
}
