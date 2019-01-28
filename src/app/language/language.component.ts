import {Component, Input, OnInit} from '@angular/core';
import {Language} from './model/Language';
import {ConfigurationService} from '../services/configuration.service';
import {TranslationService} from '../services/translation.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  @Input('type') private type: string;

  private languages: Language[] = [];

  constructor(private configuration: ConfigurationService, private translation: TranslationService) { }

  ngOnInit() {
    this.configuration.getConfig('languages').then((languages: Language[]) => {
      this.languages = languages;
      this.changeLanguage(languages[0]);
    });
  }

  public changeLanguage(language: Language): void {
    this.translation.setLanguage(language);
  }

  public getActiveLanguage(): Language {
    return this.translation.getActiveLanguage();
  }

}
