import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../translation.service';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Pipe({
  name: 'objTranslation',
  pure: true
})
export class ObjTranslationPipe implements PipeTransform {

  constructor(private translation: TranslationService) {
  }

  transform(objects: object[]): Observable<object[]> {
    const observables: Observable<object>[] = objects.map(obj =>
      this.translation.translate('stock.table-headlines.' + obj['headerName'])
        .flatMap((translation: string) => {
          obj['headerName'] = translation;
          return obj;
        })
    );

    return forkJoin(observables);
  }

}
