import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
    constructor(private oAuthService: OAuthService) {}

    public current(): Observable<any> {
        if (!this.oAuthService.hasValidAccessToken) {
            return null;
        }
        return Observable.fromPromise(this.oAuthService.loadUserProfile());
    }
}
