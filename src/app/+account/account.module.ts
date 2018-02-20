import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { routing } from './account.routes';
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './+login/login.component';
import { RegisterComponent } from './+register/register.component';
import { DynamicFormsCoreModule } from '../shared/form/core';
import {
  DynamicSmartFormModule
} from '../shared/form/dynamic-smart-form/dynamic-smart-form.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    DynamicFormsCoreModule,
    DynamicSmartFormModule
  ],
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class AccountModule {

}
