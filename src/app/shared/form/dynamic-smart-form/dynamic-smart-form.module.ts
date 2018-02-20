import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TextMaskModule } from 'angular2-text-mask';
import { DynamicSmartFormComponent } from './dynamic-smart-form.component';
import { DynamicSmartFormControlComponent } from './dynamic-smart-form-control.component';
import { DynamicFormsCoreModule } from '../core/core.module';
import { RowPipe } from 'app/shared/form/dynamic-smart-form/row.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SmartadminInputModule } from '../input/smartadmin-input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    DynamicFormsCoreModule,
    NgbModule,
    SmartadminInputModule,
    TranslateModule
  ],
  declarations: [
    DynamicSmartFormComponent,
    DynamicSmartFormControlComponent,
    RowPipe
  ],
  exports: [
    DynamicFormsCoreModule,
    DynamicSmartFormComponent,
    DynamicSmartFormControlComponent,
    RowPipe,
    SmartadminInputModule
  ]
})
export class DynamicSmartFormModule {

}
