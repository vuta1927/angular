import { Injectable } from '@angular/core';

import { JwtHelper } from 'angular2-jwt';
import { OAuthService } from 'angular-oauth2-oidc';

import { UtilityService } from './utility.service';
import { ProfileModel } from '../models/profile.model';
import { Constants } from '../../constants';
import { fail } from 'assert';

import { decode } from 'jwt-decode';
@Injectable()
export class AuthService {
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private utilityService: UtilityService,
    private oAuthService: OAuthService
  ) {}

  public getAccessToken(): string {
    return localStorage.getItem('access_token');
  }

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
    this.oAuthService.oidc = false;
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

  public getClaim(): string[]{
    let token = localStorage.getItem('access_token');
    return this.jwtHelper.decodeToken(token).Permission;
    //return this.oAuthService.getIdentityClaims();
  }
}

