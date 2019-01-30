import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchTerm = '';

  constructor(private router: Router) {
  }

  public trigger(): void {
    console.log('Search for ' + this.searchTerm);
  }
}
