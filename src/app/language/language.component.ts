import { Component, OnInit } from '@angular/core';
import {Language} from './model/Language';
import {ConfigurationService} from '../services/configuration.service';
import {TranslationService} from '../services/translation.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  private languages: Language[] = [];
  private activeLanguage: Language = new Language('Czech', 'cz');

  constructor(private configuration: ConfigurationService, private translation: TranslationService) { }

  ngOnInit() {
    this.configuration.getConfig('languages').then((languages: Language[]) => {
      console.log(languages);
      this.languages = languages;
      this.activeLanguage = languages[0];
    });
  }

  public changeLanguage(language: Language): void {
    this.activeLanguage = language;
    this.translation.setLanguage(language);
  }

}
