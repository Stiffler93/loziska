import {Pipe, PipeTransform} from '@angular/core';
import {TranslationService} from '../translation.service';

@Pipe({
  name: 'translation',
  pure: true
})
export class TranslationPipe implements PipeTransform {

  constructor(private translation: TranslationService) {
  }

  transform(value: string): Promise<string> {
    return this.translation.translate(value);
  }
}
