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
  selectedProduct: Product = new Product('', '', '');
  searchBar: object = {
    filterValue: string = '',
    focused: Boolean = false,
    open: Boolean = false
  };

  fastFilterClasses = {
    openSearchbar: false
  };
  filterClasses = {
    visibleInput: false
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
    this.configuration.getConfig('products').then((data: Array<string>) => {
      data.forEach(product => this.availableProducts.push(new Product(product['name'], product['icon'], product['text'])));
      this.changeProduct(this.availableProducts[0]);
    });
  }

  changeProduct(product: Product): void {
    this.selectedProduct = product;

    if (!this.selectedProduct.gridData || !this.selectedProduct.columnDefs) {
      this.data.getData(product.name).then(data => {
        console.log('set data');
        this.selectedProduct.gridData = data.data;
        this.selectedProduct.columnDefs = data.headers.filter(header => header !== '')
          .map(header => [{headerName: header, field: header}][0]);
      });
    }
  }

  public filter(value: string): void {
    if(value === '') {
      this.filterClasses.visibleInput = false;
      this.fastFilterClasses.openSearchbar = false;
    }
    this.filterValue = value;
    this.gridOptions.api.setQuickFilter(this.filterValue);
  }

  public openCloseSearchField(event: string, element: ElementRef) {
    if (event === 'mouseenter') {
      this.filterClasses.visibleInput = true;
      this.fastFilterClasses.openSearchbar = true;
    } else if (event === 'mouseleave' && this.filterValue === '') {
      this.filterClasses.visibleInput = false;
      this.fastFilterClasses.openSearchbar = false;
    }
  }
}
