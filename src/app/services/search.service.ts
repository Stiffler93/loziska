import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchTermSubject: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private router: Router) {
  }

  public change(term: string): void {
    this.searchTermSubject.next(term);
  }

  public onChange(): Observable<string> {
    return this.searchTermSubject.asObservable();
  }

  public trigger(): void {
    if (this.router.url !== '/our-stock') {
      this.router.navigateByUrl('/our-stock');
    }
  }

  public isActive(): boolean {
    return this.searchTermSubject.value !== '';
  }
}
