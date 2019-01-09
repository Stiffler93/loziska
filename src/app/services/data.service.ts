import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {HttpClient} from '@angular/common/http';
import {resolve} from 'q';
import {TableData} from './model/TableData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  loaded: Boolean = false;
  data: object[] = [];
  headers: string[] = [];

  constructor(private papa: Papa, private http: HttpClient) {
  }

  private loadData(): Promise<TableData> {
    console.log('load Data');

    return this.http.get('assets/data/Gufera.csv', {responseType: 'text'})
      .toPromise()
      .then(stream => {
        this.parseData(stream);
        return new TableData(this.headers, this.data);
      });
  }

  private parseData(stream: string) {
    console.log('parse Data');

    this.papa.parse(stream, {
      header: true,
      complete: (result) => {
        console.log('Parsed: ', result);
        this.data = result.data;
        this.headers = result.meta.fields;
        this.loaded = true;
      }, error: error1 => {
        console.log('Error during Parsing');
        console.log(error1);
      }
    });
  }

  public getData(): Promise<TableData> {
    return new Promise<TableData>(resolve => {
      if (!this.loaded) {
        resolve(this.loadData());
      } else {
        resolve(new TableData(this.headers, this.data));
      }
    });
  };

}
