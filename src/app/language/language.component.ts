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

  @Input('type') type: string;

  languages: Language[] = [];

  constructor(private configuration: ConfigurationService, private translation: TranslationService) {
  }

  ngOnInit() {
    this.configuration.getConfig('languages')
      .subscribe((languages: Language[]) => {
        this.languages = languages;
      });
  }

  public changeLanguage(language: Language): void {
    this.translation.setLanguage(language);
  }

  public getActiveLanguage(): Language {
    return this.translation.getActiveLanguage();
  }

}
