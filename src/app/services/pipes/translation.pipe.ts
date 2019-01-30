import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../translation.service';
import {Observable} from 'rxjs';

@Pipe({
  name: 'translation', pure: true
})
export class TranslationPipe implements PipeTransform {

  constructor(private translation: TranslationService) {
  }

  transform(value: string): Observable<string> {
    return this.translation.translate(value);
  }
}
