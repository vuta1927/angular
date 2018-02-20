import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavigationComponent } from './navigation-component';
import { SmartMenuDirective } from './smart-menu.directive';
import { UserModule } from '../../user/user.module';
import { MinifyMenuComponent } from './minify-menu.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UserModule
  ],
  declarations: [
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective
  ],
  exports: [
    MinifyMenuComponent,
    NavigationComponent,
    SmartMenuDirective
  ]
})
export class NavigationModule {}
