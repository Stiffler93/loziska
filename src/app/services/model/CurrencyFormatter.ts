import {TranslationService} from '../translation.service';
import {HttpClient} from '@angular/common/http';

export class CurrencyFormatter {

  private exchangeRate: number;

  constructor(private translation: TranslationService, private http: HttpClient) {
    console.log('Constructor: CurrencyFormatter');

    this.http.get('https://api.exchangeratesapi.io/latest').subscribe(exchangeRates => {
      this.exchangeRate = exchangeRates['rates']['CZK'];
    });
  }

  public format = (params) => {
    if (this.translation.getActiveLanguage().short === 'cz') {
      return params.value + ' CZK';
    }

    const czk: string = params.value.replace(',', '.');
    const eur: number = +czk / this.exchangeRate;
    const eurString: string = eur.toFixed(2) + ' EUR';
    return params.value + ' CZK (~' + eurString.replace('.', ',') + ')';
  }
}
