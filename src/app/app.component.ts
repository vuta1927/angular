/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { merge } from 'rxjs/observable/merge';
import { filter, map, mergeMap } from 'rxjs/operators';

import { AppState } from './app.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from './shared/i18n/i18n.service';
import { LoggerService } from './core/services/log/logger.service';

import { environment } from '../environments/environment';

import { languages } from './core/models';
import { JwksValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    public appState: AppState,
    public translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private i18nService: I18nService,
    private logger: LoggerService,
    private oauthService: OAuthService
  ) {
    // Setup logger
    if (environment.production) {
      this.logger.enableProductionMode();
    }

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, languages);

    const onNavigationEnd =
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translate.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translate.instant(title));
        }
      });

    this.configureOidc();
  }

  public ngOnInit() {
    this.logger.debug('Initial App State ', this.appState.state);
  }

  private configureOidc() {
    this.oauthService.configure(authConfig(environment.API_BASE_ENDPOINT));
    this.oauthService.setStorage(localStorage);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
