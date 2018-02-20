import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { FullScreenComponent } from './full-screen';
import { HeaderComponent } from './header.component';
import { CollapseMenuComponent } from './collapse-menu/collapse-menu.component';
import { I18nModule } from '../../i18n/i18n.module';
import { ActivitiesComponent } from './activities/activities.component';
import {
  ActivitiesMessageComponent
} from './activities/activities-message/activities-message.component';
import { PipeModule } from '../../pipe/pipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserModule } from 'app/shared/user/user.module';
import {
  ActivitiesNotificationComponent
} from './activities/activities-notification/activities-notification.component';
import { $ } from 'protractor';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    I18nModule,
    PipeModule,
    UserModule,
  ],
  declarations: [
    ActivitiesMessageComponent,
    ActivitiesNotificationComponent,
    FullScreenComponent,
    CollapseMenuComponent,
    ActivitiesComponent,
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
