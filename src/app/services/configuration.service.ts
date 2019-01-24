import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  configuration: object = {};
  loaded = false;
  promise: Promise<object> = undefined;

  constructor(private http: HttpClient) {
  }

  public loadConfig(): Promise<object> {
    console.log('loadConfig!');
    return this.http.get('assets/configuration.json', {responseType: 'json'})
      .toPromise()
      .then(data => {
        console.log('ConfigurationService:');
        this.configuration = data;
        this.loaded = true;
        this.promise = undefined;

        return this.configuration;
      });
  }

  public getConfig(key: string): Promise<object> {
    if (this.loaded) {
      if (this.configuration[key]) {
        return Promise.resolve(this.configuration[key]);
      } else {
        return Promise.resolve({'default': 'no value'});
      }
    }

    if (!this.promise) {
      this.promise = this.loadConfig();
    }

    return this.promise.then(configuration => {
      return configuration[key];
    });
  }
}
