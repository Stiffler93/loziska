import {Component, OnDestroy, OnInit} from '@angular/core';
import {Product} from './model/Product';
import {DataService} from '../services/data.service';
import {ConfigurationService} from '../services/configuration.service';
import {GridOptions} from 'ag-grid-community';
import {SearchService} from '../services/search.service';
import {combineLatest, Observable, Subscription} from 'rxjs';

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

  constructor(private data: DataService, private configuration: ConfigurationService, private search: SearchService) {
  }

  ngOnInit() {
    const subscription = this.configuration.getConfig('products').subscribe((value: string[]) => {
      this.parseProducts(value, this.availableProducts);
      this.switchToProductWithMostMatches();
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private parseProducts(data: string[], target: Product[]): void {
    const observables: Observable<Product>[] = [];

    data.forEach(productString => {
      const p: Product = new Product(productString['name'], productString['file'], productString['icon'], productString['text']);
      observables.push(this.data.getData(p));
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

    combineLatest(observables).subscribe(() => {
      this.calculateFilterResults();
    });
  }

  private parseParameters(data: string[], target: string[]): void {
    data.forEach(parameter => {
      target.push(parameter);
    });
  }

  public changeProduct(product: Product): void {
    this.selectedProduct = product;
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
      const searchTerms: string[] = searchTerm.split(' ').filter(term => term !== '').map(term => term.toLowerCase());

      this.availableProducts.forEach((product: Product) => {
        if (product.gridData) {
          const column: object = product.columnDefs[0];

          const length = product.gridData.filter((row: object) => {
            let value: string = row[column['field']];

            if (value) {
              value = value.toLowerCase();
              for (let i = 0; i < searchTerms.length; i++) {
                if (value.indexOf(searchTerms[i]) === -1) {
                  return false;
                }
              }
            } else {
              return false;
            }

            return true;
          }).length;
          product.numData = length;
        }
      });
    });

    this.subscriptions.push(subscription);
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
