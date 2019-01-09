import {Component, OnInit} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-our-stock',
  templateUrl: './our-stock.component.html',
  styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit {

  availableProducts: Product[] = [];
  selectedProduct: Product;

  public columnDefs: object[] = [];
  public gridData: object[] = [];

  constructor(private data: DataService) {
  }

  ngOnInit() {
    const p1: Product = new Product('Universal', 'fa fa-universal-access',
      'This is some text that describes this product. It should be rather long to see how longer test is displayed. ' +
      'The text should also be auto wrapped.');
    const p2: Product = new Product('Ambulance', 'fa fa-ambulance',
      'This is some text that describes this product. It should be rather long to see how longer test is displayed. ' +
      'The text should also be auto wrapped.', ['Option 1', 'Option 2', 'Option 3']);
    this.availableProducts.push(p1);
    this.availableProducts.push(p2);

    this.selectedProduct = this.availableProducts[0];

    this.data.getData().then(data => {
      console.log('set data');
      this.gridData = data.data;
      this.columnDefs = data.headers.filter(header => header != "").map(header => [{headerName: header, field: header}][0]);
    });
  }

  changeProduct = function(product: Product) {
    this.selectedProduct = product;
  };
}
