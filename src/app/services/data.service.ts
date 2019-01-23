import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {HttpClient} from '@angular/common/http';
import {TableData} from './model/TableData';
import {Product} from '../our-stock/model/Product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data: object[] = [];
  headers: string[] = [];

  constructor(private papa: Papa, private http: HttpClient) {
  }

  private loadData(product: Product): Promise<TableData> {
    console.log('Load ' + product.name);

    if (!product.file && product.subproducts) {
      const promises: Array<Promise<TableData>> = [];
      product.subproducts.forEach(subproduct => promises.push(this.loadData(subproduct)));
      return Promise.all(promises).then(tableDatas => {
        let combinedTableData: object[] = [];
        tableDatas.forEach(tableData => {
          combinedTableData = combinedTableData.concat(tableData.data);
        });
        return new TableData(tableDatas[0].headers, combinedTableData);
      });
    } else if (!product.file) {
      return new Promise<TableData>(resolve => {
        return new TableData([''], [{}]);
      });
    }

    return this.http.get('assets/data/' + product.file, {responseType: 'text'})
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
        this.data = result.data;
        this.headers = result.meta.fields;
      }, error: error1 => {
        console.log('Error during Parsing');
        console.log(error1);
      }
    });
  }

  public getData(product: Product): Promise<TableData> {
    return new Promise<TableData>(resolve => {
      resolve(this.loadData(product));
    });
  }
}
