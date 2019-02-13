import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Language} from '../language/model/Language';
import {TranslationService} from './translation.service';
import {HttpClient} from '@angular/common/http';
import {CurrencyFormatter} from './model/CurrencyFormatter';

@Injectable({
  providedIn: 'root'
})
export class AgGridService {

  private currencyFormatter: CurrencyFormatter;

  private excludedColumns: string[] = [];
  private enhancedColumnDefinitions: object[] = [];

  constructor(private configuration: ConfigurationService, private translation: TranslationService, private http: HttpClient) {
    this.configuration.getConfig('ag-grid')
      .subscribe(agGridConfig => {
        this.excludedColumns = agGridConfig['excludedColumns'];
        this.enhancedColumnDefinitions = agGridConfig['columnDefinitions'];
      });

    this.currencyFormatter = new CurrencyFormatter(this.translation, this.http);
  }

  public createColumnDefinitions(columns: string[]): object[] {
    return columns.filter(header => header !== '' && this.excludedColumns.indexOf(header) === -1)
      .map((header) => {
        const obj = {
          headerName: header,
          field: header
        };
        const enhancement = this.enhancedColumnDefinitions.filter(def => def['headerName'] === header)[0];

        if (enhancement) {
          Object.assign(obj, enhancement['definitions']);

          if (obj['getQuickFilterText']) {
            obj['getQuickFilterText'] = (params) => null;
          }

          if (obj['currencyFormatter']) {
            obj['valueFormatter'] = this.currencyFormatter.format;
          }
        }

        return [obj][0];
      });
  }
}
