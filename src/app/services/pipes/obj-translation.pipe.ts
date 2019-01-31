import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../translation.service';
import {zip, Observable, combineLatest} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Pipe({
  name: 'objTranslation', pure: true
})
export class ObjTranslationPipe implements PipeTransform {

  constructor(private translation: TranslationService) {
  }

  transform(objects: object[]): Observable<object[]> {
    const observables: Observable<object>[] = objects.map(obj => this.translation.translate('stock.table-headlines.' + obj['headerName'])
      .pipe(map((value: string) => {
        return {headerName: value, field: obj['field']};
      })));

    return combineLatest(observables);
  }

}
