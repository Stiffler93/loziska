import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {HttpClient} from '@angular/common/http';
import {resolve} from 'q';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  loaded: Boolean = false;
  data: any[] = [];

  constructor(private papa: Papa, private http: HttpClient) {
  }

  private loadData(): Promise<any[]> {
    console.log('load Data');

    return this.http.get('assets/data/Gufera.csv', {responseType: 'text'})
      .toPromise()
      .then(data => {
        this.parseData(data);
        // resolve(this.data);
        return this.data;
      });
  }

  private parseData(data) {
    console.log('parse Data');

    this.papa.parse(data, {
      complete: (result) => {
        console.log('Parsed: ', result);
        this.data = result.data;
        this.loaded = true;
      }, error: error1 => {
        console.log('Error during Parsing');
        console.log(error1);
      }
    });
  }

  public getData(): Promise<any[]> {
    return new Promise<any[]>(resolve => {
      if (!this.loaded) {
        resolve(this.loadData());
      } else {
        resolve(this.data);
      }
    });
  };

  public test(): Promise<string> {
    return this.http.get('assets/data/Gufera.csv', {responseType: 'text'}).toPromise();
  }

}
