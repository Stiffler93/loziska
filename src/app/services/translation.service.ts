import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Translation} from './model/Translation';
import {HttpClient} from '@angular/common/http';
import {Language} from '../language/model/Language';
import {forkJoin, Observable, ReplaySubject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private translations: Translation[] = [];
  private activeLanguage: Language = new Language('Czech', 'cz');
  private activeTranslationSubject: ReplaySubject<Translation> = new ReplaySubject(1);

  constructor(private http: HttpClient, private configuration: ConfigurationService) {
    this.configuration.getConfig('languages')
      .pipe(
        map((languages: Language[]) => {
          return languages.map((language: Language) => new Translation(language));
        }),
        switchMap((translations: Translation[]) => {
          const observables: Observable<Translation>[] = translations.map((translation: Translation) =>
            this.http.get('assets/translations/' + translation.language.short + '.json', {responseType: 'json'})
              .pipe(
                map(result => {
                  translation.parse(result);
                  return translation;
                })
              )
          );

          return forkJoin(observables);
        })
      ).subscribe((translations: Translation[]) => {
      translations.forEach((translation: Translation) => this.translations[translation.language.short] = translation);
      this.activeTranslationSubject.next(this.translations[this.activeLanguage.short]);
    });
  }

  public translate(value: string): Observable<string> {
    return this.activeTranslationSubject.asObservable()
      .pipe(map((translation: Translation) => this.getTranslationForKey(translation, value)));
  }

  private getTranslationForKey(translation: Translation, key: string): string {
    let content: object = translation['content'];
    const path: string[] = key.split('.');

    for (let i = 0; i < path.length - 1; i++) {
      content = content[path[i]];
    }

    const translatedString: string = content[path[path['length'] - 1]];
    return (!translatedString || translatedString === '') ? key : translatedString;
  }

  public setLanguage(language: Language): void {
    if (this.activeLanguage.short !== language.short) {
      this.activeLanguage = language;
      this.activeTranslationSubject.next(this.translations[language.short]);
    }
  }

  public getActiveLanguage(): Language {
    return this.activeLanguage;
  }
}
