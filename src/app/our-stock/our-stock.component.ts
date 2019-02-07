import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';
import {SearchService} from '../services/search.service';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-our-stock', templateUrl: './our-stock.component.html', styleUrls: ['./our-stock.component.scss']
})
export class OurStockComponent implements OnInit, OnDestroy {

  private availableProducts: Product[] = [];
  private selectedProduct: Product = new Product('', '', '', '');

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
        }
      });
      this.subscriptions.push(subscription);
    }
  };

  private subscriptions: Subscription[] = [];

  constructor(public data: DataService, public configuration: ConfigurationService, public search: SearchService) {
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

  private parseProducts(data: object[], target: Product[]): void {
    const observables: Observable<Product>[] = [];

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

    if (this.availableProducts[bestMatch].subproducts) {
      let bestSubMatch = 0;
      for (let i = 1; i < this.availableProducts[bestMatch].subproducts.length; i++) {
        if (this.availableProducts[bestMatch].subproducts[i].numData >
          this.availableProducts[bestMatch].subproducts[bestSubMatch].numData) {
          bestSubMatch = i;
        }
      }

      this.changeProduct(this.availableProducts[bestMatch].subproducts[bestSubMatch]);
    } else {
      this.changeProduct(this.availableProducts[bestMatch]);
    }
  }

}
