import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {HttpClient} from '@angular/common/http';
import {TableData} from './model/TableData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data: object[] = [];
  headers: string[] = [];

  constructor(private papa: Papa, private http: HttpClient) {
  }

  private loadData(product: string): Promise<TableData> {
    console.log('Load ' + product);
    return this.http.get('assets/data/' + product + '.csv', {responseType: 'text'})
      .toPromise()
      .then(stream => {
        this.parseData(stream);
        return new TableData(this.headers, this.data);
      });
  }

  private parseData(stream: string) {
    this.papa.parse(stream, {
      header: true,
      complete: (result) => {
        console.log('Parsed: ', result);
        this.data = result.data;
        this.headers = result.meta.fields;
      }, error: error1 => {
        console.log('Error during Parsing');
        console.log(error1);
      }
    });
  }

  public getData(product: string): Promise<TableData> {
    return new Promise<TableData>(resolve => {
      resolve(this.loadData(product));
    });
  }
}
