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
    return Observable.create(observer => {
      this.translation.translate(value).then((translation: string) => observer.next(translation));
      this.translation.onLanguageChange().subscribe(() => {
        this.translation.translate(value).then((translation: string) => observer.next(translation));
      })
    });
  }
}
