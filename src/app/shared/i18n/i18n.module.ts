import { NgModule } from '@angular/core';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  declarations: [
    LanguageSelectorComponent
  ],
  exports: [
    LanguageSelectorComponent
  ]
})
export class I18nModule {}
