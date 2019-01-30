import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) {
  }

  public loadConfig(): Observable<object> {
    return this.http.get('assets/configuration.json', {responseType: 'json'});
  }

  public getConfig(key: string): Observable<object> {
    return this.loadConfig().pipe(map(value => value[key]));
  }
}
