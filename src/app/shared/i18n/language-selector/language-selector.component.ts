import { Component, OnInit } from '@angular/core';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html'
})
export class LanguageSelectorComponent implements OnInit {
  public languages: any[];
  public currentLanguage: any;

  constructor(private i18nService: I18nService) {}

  public ngOnInit() {
    this.languages = this.i18nService.supportedLanguages;
    this.currentLanguage = this.i18nService.language;
  }

  public setLanguage(language: any) {
    this.currentLanguage = language;
    this.i18nService.language = language;
  }
}
