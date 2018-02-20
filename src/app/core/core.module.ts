import { ModuleWithProviders, NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { NG_VALIDATORS } from '@angular/forms';

import { OAuthModule } from 'angular-oauth2-oidc';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { SpinnerInterceptor } from './services/interceptors/spinner.interceptor';
import { LayoutService } from '../shared/layout/layout.service';
import { I18nService } from '../shared/i18n/i18n.service';
import { LoggerService } from './services/log/logger.service';
import { LoggerPublishersService } from './services/log/logger-publishers.service';
import { SpinnerService } from './services/spinner.service';
import { UtilityService } from './services/utility.service';
import { DataService } from './services/data.service';
import { DynamicFormsCoreModule } from 'app/shared/form/core/core';
import { mathOther } from 'app/shared/validators/match-other-validator.validator';
import { TranslateHttpClientLoader } from 'app/shared/i18n/http-client-loader';
import { UserService } from 'app/shared/user/user.service';
import { ApiEndpointInterceptor } from './services/interceptors/api-endpoint.interceptor';
import { GlobalErrorHandler } from './services/global-error.service';
import { AuthGuard } from './guards/auth.guard';
import { AppServiceProvider } from './services/app.service';

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpClientLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      // loader: {
      //   provide: TranslateLoader,
      //   useFactory: (createTranslateLoader),
      //   deps: [HttpClient]
      // }
    }),
    DynamicFormsCoreModule.forRoot()
  ],
  exports: [
    HttpClientModule
  ]
})
export class CoreModule {

  // forRoot allows to override providers
  // https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        DataService,
        AuthService,
        AuthGuard,
        I18nService,
        LoggerService,
        LoggerPublishersService,
        SpinnerService,
        LayoutService,
        UtilityService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiEndpointInterceptor, multi: true },
        // { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: NG_VALIDATORS, useValue: mathOther, multi: true },
        UserService,
        AppServiceProvider
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. Import Core modules in the AppModule only.');
    }
  }
}
