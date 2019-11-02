import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';
import {SearchService} from '../services/search.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-our-stock', templateUrl: './our-stock.component.html', styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit, OnDestroy {

  private availableProducts: Product[] = [];
  private selectedProduct: Product = new Product('', '', '', '');
  private mobileView = false;

  searchBar = {
    focused: false, hovered: false
  };

  public gridOptions: GridOptions = {
    enableColResize: true, enableSorting: true, onModelUpdated: () => {
      this.gridOptions.columnApi.autoSizeAllColumns();
    }, onFirstDataRendered: () => {
      const subscription = this.search.onChange().subscribe(value => {
        if (this.gridOptions.api) {
          this.gridOptions.api.setQuickFilter(value);
          this.switchToProductWithMostMatches();
        }
      });
      this.subscriptions.push(subscription);
    }
  };

  private subscriptions: Subscription[] = [];

  constructor(public data: DataService, public configuration: ConfigurationService, public search: SearchService) {
    this.onResize();
  }

  ngOnInit() {
    const subscription = this.configuration.getConfig('products').subscribe((value: object[]) => {
      this.parseProducts(value, this.availableProducts);
      this.switchToProductWithMostMatches();
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.availableProducts.forEach((product: Product) => {
      product.unlinkFromSearch();
    });

    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(): void {
    console.log('onResize');
    const newValue = window.innerWidth < 768;
    if (newValue !== this.mobileView) {
      this.mobileView = newValue;
      console.log('mobileView: ' + this.mobileView);
    }
  }

  private parseProducts(data: object[], target: Product[]): void {
    data.forEach(productObject => {
      const p: Product = new Product(productObject['name'], productObject['file'], productObject['icon'], productObject['text']);

      if (productObject['parameters']) {
        this.parseParameters(productObject['parameters'], p.parameters);
      }
      if (productObject['products']) {
        if (!p.subproducts) {
          p.subproducts = [];
        }
        this.parseProducts(productObject['products'], p.subproducts);
      }

      this.data.getData(p).subscribe(() => p.linkToSearch(this.search));
      target.push(p);
    });
  }

  private parseParameters(data: string[], target: string[]): void {
    data.forEach(parameter => {
      target.push(parameter);
    });
  }

  public changeProduct(product: Product): void {
    if (this.selectedProduct !== product) {
      this.selectedProduct = product;
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

  private switchToProductWithMostMatches(): void {
    let bestMatch = 0;

    if (this.search.isActive()) {
      for (let i = 1; i < this.availableProducts.length; i++) {
        if (this.availableProducts[i].numData > this.availableProducts[bestMatch].numData) {
          bestMatch = i;
        }
      }
    }

    this.changeProduct(this.availableProducts[bestMatch]);
  }

}
