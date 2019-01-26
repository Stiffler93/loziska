import { Pipe, PipeTransform } from '@angular/core';
import {TranslationService} from '../translation.service';

@Pipe({
  name: 'objTranslation',
  pure: true
})
export class ObjTranslationPipe implements PipeTransform {

  constructor(private translation: TranslationService) {}

  transform(value: object[]): Promise<object[]> {
    console.log(value);
    const promises: Promise<object>[] = value.map(obj => new Promise<object>(resolve => {
      resolve(this.translation.translate('stock.table-headlines.' + obj['headerName']).then((translation: string) => {
        obj['headerName'] = translation;
        return obj;
      }));
    }));

    return Promise.all(promises);
  }

}
