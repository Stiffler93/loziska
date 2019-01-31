import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';
import {SearchService} from '../services/search.service';
import {Observable, of, Subscription} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-our-stock', templateUrl: './our-stock.component.html', styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit, OnDestroy {

  private availableProducts: Product[] = [];
  private selectedProduct: Product = new Product('', '', '', '');

  searchBar = {
    focused: false,
    hovered: false
  };

  public gridOptions: GridOptions = {
    enableColResize: true, enableSorting: true, onModelUpdated: () => {
      this.gridOptions.columnApi.autoSizeAllColumns();
    },
    onFirstDataRendered: () => {
      const subscription = this.search.onChange().subscribe(value => {
        if (this.gridOptions.api) {
          console.log('Grid Ready and API available');
          this.gridOptions.api.setQuickFilter(value);
        }
      });
      this.subscriptions.push(subscription);
    }
  };

  private subscriptions: Subscription[] = [];

  constructor(private data: DataService, private configuration: ConfigurationService, private search: SearchService) {
  }

  ngOnInit() {
    console.log('On Init');
    const subscription = this.configuration.getConfig('products').subscribe((value: string[]) => {
      this.parseProducts(value, this.availableProducts);
      this.changeProduct(this.availableProducts[0]);
    });
    this.subscriptions.push(subscription);

    this.calculateFilterResults();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      console.log({'Unsubscribe': subscription});
      subscription.unsubscribe();
    });
  }

  private parseProducts(data: string[], target: Product[]): void {
    data.forEach(productString => {
      const p: Product = new Product(productString['name'], productString['file'], productString['icon'], productString['text']);
      this.data.getData(p).subscribe(() => {
      });
      if (productString['parameters']) {
        this.parseParameters(productString['parameters'], p.parameters);
      }
      if (productString['products']) {
        if (!p.subproducts) {
          p.subproducts = [];
        }
        this.parseProducts(productString['products'], p.subproducts);
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
    this.selectedProduct = product;

    if (!this.selectedProduct.gridData) {
      this.data.getData(product).subscribe(() => {
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

  public getAvailableProducts(): Product[] {
    return this.availableProducts;
  }

  public getSelectedProduct(): Product {
    return this.selectedProduct;
  }

  private calculateFilterResults(): void {
    const subscription = this.search.onChange().subscribe((searchTerm: string) => {
      this.availableProducts.forEach((product: Product) => {
        if (product.gridData) {
          const length = product.gridData.filter((row: object) => {
            for (let i = 0; i < product.columnDefs.length; i++) {
              const column: object = product.columnDefs[i];
              const value: string = row[column['field']];
              if (value && (value.indexOf(searchTerm) >= 0 || value.indexOf(searchTerm.toUpperCase()) >= 0)) {
                return true;
              }
            }

            return false;
          }).length;
          product.numData = length;
          console.log({'product': product});
        }
      });
    });

    this.subscriptions.push(subscription);
  }
}
