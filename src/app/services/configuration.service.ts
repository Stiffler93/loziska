import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configuration: object = {};
  loaded = false;

  constructor(private http: HttpClient) {
  }

  private loadConfig(key: string): Promise<object> {
    return this.http.get('assets/configuration.json', {responseType: 'json'})
      .toPromise()
      .then(data => {
        console.log('ConfigurationService:');
        this.configuration = data;
        this.loaded = true;

        return this.configuration[key];
      });
  }

  public getConfig(key: string): Promise<object> {
    return new Promise<object>(resolve => {
      if (this.loaded) {
        if (this.configuration[key]) {
          resolve(this.configuration[key]);
        } else {
          resolve({'default': 'no value'});
        }
      } else {
        resolve(this.loadConfig(key));
      }
    });
  }
}
