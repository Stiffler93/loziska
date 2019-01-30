import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Translation} from './model/Translation';
import {HttpClient} from '@angular/common/http';
import {Language} from '../language/model/Language';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private changeSubject: Subject<boolean> = new Subject<boolean>();
  private activeLanguage: Language = new Language('Czech', 'cz');
  private loaded = false;
  private translations: Translation[] = [];
  private promise: Promise<Translation[]>;

  constructor(private http: HttpClient, private configuration: ConfigurationService) {
  }

  private load(): Promise<Translation[]> {
    this.promise = this.configuration.getConfig('languages').then((config: Language[]) => {
      const loadTranslations: Promise<Translation>[] = config.map((language: Language) => new Promise<Translation>((resolve) => {
        resolve(this.http.get('assets/translations/' + language.short + '.json', {responseType: 'json'}).toPromise()
          .then(result => {
            const trans: Translation = new Translation(language.name, language.short);
            trans.parse(result);
            this.translations[language.short] = trans;
            console.log('translations for ' + language.short + ' loaded');
            return trans;
          }));
      }));

      return Promise.all(loadTranslations).then(() => {
        this.loaded = true;
        return this.translations;
      });
    });

    return this.promise;
  }

  public translate(value: string): Promise<string> {

    if (this.loaded) {
      let content: object = this.translations[this.activeLanguage.short]['content'];
      const path: string[] = value.split('.');

      for (let i = 0; i < path.length - 1; i++) {
        content = content[path[i]];
      }

      const translation: string = content[path[path['length'] - 1]];
      return (!translation || translation === '') ? Promise.resolve(value) : Promise.resolve(translation);
    }

    if (!this.promise) {
      this.promise = this.load();
    }

    return this.promise.then((translations: Translation[]) => {
      let content: object = translations[this.activeLanguage.short]['content'];
      const path: string[] = value.split('.');

      for (let i = 0; i < path.length - 1; i++) {
        content = content[path[i]];
      }

      const translation: string = content[path[path['length'] - 1]];
      return (!translation || translation === '') ? value : translation;
    });
  }

  public setLanguage(language: Language): void {
    console.log('change Language to ' + language.name);
    if (this.activeLanguage !== language) {
      this.activeLanguage = language;
      this.changeSubject.next(true);
    }
  }

  public onLanguageChange(): Observable<boolean> {
    return this.changeSubject.asObservable();
  }

  public getActiveLanguage(): Language {
    return this.activeLanguage;
  }
}
