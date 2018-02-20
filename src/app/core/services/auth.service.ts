import { Injectable } from '@angular/core';

import { JwtHelper } from 'angular2-jwt';
import { OAuthService } from 'angular-oauth2-oidc';

import { UtilityService } from './utility.service';
import { ProfileModel } from '../models/profile.model';
import { Constants } from '../../constants';

@Injectable()
export class AuthService {
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private utilityService: UtilityService,
    private oAuthService: OAuthService
  ) {}

  public get isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  public get user(): ProfileModel | undefined {
    if (this.idToken) {
      return this.jwtHelper.decodeToken(this.idToken);
    }
    return undefined;
  }

  public getUserInfo(): Promise<object> {
    return this.oAuthService.loadUserProfile();
  }

  public logout() {
    this.oAuthService.logOut();
    this.utilityService.navigateToSignIn();
  }

  public get accessToken(): string {
    return this.oAuthService.getAccessToken();
  }

  // Used to access user information
  public get idToken(): string {
    return this.oAuthService.getIdToken();
  }
}
