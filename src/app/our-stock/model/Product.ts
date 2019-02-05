import {SearchService} from '../../services/search.service';
import {ISubscription} from 'rxjs-compat/Subscription';

export class Product {

  columnDefs: object[] = [];
  gridData: object[] = undefined;
  subproducts: Product[] = undefined;
  numData = 0;

  private subscription: ISubscription;

  constructor(public name: string, public file: string, public icon: string, public text: string, public parameters: string[] = []) {
  }

  public linkToSearch(search: SearchService) {
    this.subscription = search.onChange().subscribe((searchTerm: string) => {
      this.calculateFilterResults(searchTerm);
    });
  }

  public unlinkFromSearch(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private calculateFilterResults(searchTerm: string): void {

    if (this.gridData) {
      const searchTerms: string[] = searchTerm.split(' ').filter(term => term !== '').map(term => term.toLowerCase());
      const column: object = this.columnDefs[0];

      const length = this.gridData.filter((row: object) => {
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
      this.numData = length;
    }
  }
}
