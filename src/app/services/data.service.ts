import {Injectable} from '@angular/core';
import {Papa} from 'ngx-papaparse';
import {HttpClient} from '@angular/common/http';
import {Product} from '../our-stock/model/Product';
import {forkJoin, Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data: object[] = [];
  headers: string[] = [];

  constructor(private papa: Papa, private http: HttpClient) {
  }

  private loadData(product: Product): Observable<Product> {
    if (!product.file && product.subproducts) {
      const observables: Observable<Product>[] = [];
      product.subproducts.forEach(subproduct => observables.push(this.loadData(subproduct)));

      return forkJoin(observables).pipe(
        map(subproducts => {
          let combinedTableData: object[] = [];
          subproducts.forEach((subproduct: Product) => {
            combinedTableData = combinedTableData.concat(subproduct.gridData);
          });

          product.gridData = combinedTableData;
          product.columnDefs = subproducts[0].columnDefs.filter(header => header['headerName'] !== '');
          return product;
        }));
    } else if (!product.file) {
      product.columnDefs = [{}];
      product.gridData = [{}];
      return of(product);
    }

    return this.http.get('assets/data/' + product.file, {responseType: 'text'})
      .pipe(
        map(value => {
          this.parseData(value);
          product.gridData = this.data;
          product.columnDefs = this.headers.filter(header => header !== '')
            .map(header => [{headerName: header, field: header}][0]);
          return product;
        }));
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

  public getData(product: Product): Observable<Product> {
    if (product.gridData) {
      const headers: string[] = product.columnDefs.map(value => value['headerName']);
      return of(product);
    }

    return this.loadData(product);
  }
}
