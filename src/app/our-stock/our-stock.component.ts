import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';
import {AgGridColumn} from 'ag-grid-angular';

@Component({
  selector: 'app-our-stock',
  templateUrl: './our-stock.component.html',
  styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit {

  @ViewChild('#filter') filterInput;

  availableProducts: Product[] = [];
  selectedProduct: Product = new Product('', '', '');

  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    onModelUpdated: () => {
      console.log('grid model updated');
      // this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.columnApi.autoSizeAllColumns();
      // this.gridOptions.api.refreshView();
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

  public filter(): void {
    // console.log('Filter: ' + this.filterInput.value);
    this.gridOptions.api.setQuickFilter(this.filterInput.value); // not working, value cannot be read
  }
}
