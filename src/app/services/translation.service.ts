import {Injectable} from '@angular/core';
import {ConfigurationService} from './configuration.service';
import {Translation} from './model/Translation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  public activeLanguage = 'cz';
  private loaded = false;
  private translations: Translation[] = [];
  private promise: Promise<Translation[]>;

  constructor(private http: HttpClient, private configuration: ConfigurationService) {
  }

  private load(): Promise<Translation[]> {
    this.promise = this.configuration.getConfig('languages').then((config: object[]) => {
      const loadTranslations: Promise<Translation>[] = config.map(language => new Promise<Translation>((resolve) => {
        resolve(this.http.get('assets/translations/' + language['short'] + '.json', {responseType: 'json'}).toPromise()
          .then(result => {
            const trans: Translation = new Translation(language['name'], language['short']);
            trans.parse(result);
            this.translations[language['short']] = trans;
            console.log('translations for ' + language['short'] + ' loaded');
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
      let content: object = this.translations[this.activeLanguage]['content'];
      const path: string[] = value.split('.');

      for (let i = 0; i < path.length - 1; i++) {
        content = content[path[i]];
      }

      return Promise.resolve(content[path[path['length'] - 1]]);
    }

    if (!this.promise) {
      this.promise = this.load();
    }

    return this.promise.then((translations: Translation[]) => {
      console.log('Resolve translate()');
      let content: object = translations[this.activeLanguage]['content'];
      const path: string[] = value.split('.');

      for (let i = 0; i < path.length - 1; i++) {
        content = content[path[i]];
      }

      return content[path[path['length'] - 1]];
    });
  }
}
