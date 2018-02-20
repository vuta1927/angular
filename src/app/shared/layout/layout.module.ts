import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoadingIndicatorComponent } from 'app/shared/layout/loading-indicator';
import { HeaderModule } from './header/header.module';
import { FooterComponent } from './footer/footer.component';
import { MainLayoutComponent } from 'app/shared/layout/app-layout/main-layout.component';
import { NavigationModule } from './navigation';
import { AuthLayoutComponent } from './app-layout/auth-layout.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { RouteBreadcrumbsComponent } from './ribbon/route-breadcrumbs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../utils/utils.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        HeaderModule,
        NavigationModule,
        FormsModule,
        RouterModule,
        NgbModule,
        UtilsModule,
        TranslateModule
    ],
    declarations: [
        LoadingIndicatorComponent,
        FooterComponent,
        MainLayoutComponent,
        AuthLayoutComponent,
        RibbonComponent,
        RouteBreadcrumbsComponent
    ],
    exports: [
        LoadingIndicatorComponent,
        HeaderModule,
        NavigationModule,
        FooterComponent,
        RibbonComponent
    ]
})
export class LayoutModule {}
