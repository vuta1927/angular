import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LayoutModule } from 'app/shared/layout/layout.module';
import { I18nModule } from './i18n/i18n.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    I18nModule,
    LayoutModule,
  ]
})
export class SharedModule {}
