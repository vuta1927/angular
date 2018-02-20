import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth header from the server
    const auth: AuthService = this.injector.get(AuthService);

    if (!auth.isLoggedIn) {
      return next.handle(req);
    }

    const authHeader = auth.accessToken;
    // Clone the request to add the new header

    // const authReq = req.clone({ headers: req.headers.set('Authorization', authHeader) });
    // OR shortcut
    const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + authHeader } });
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
