import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class ApiEndpointInterceptor implements HttpInterceptor {

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const apiEndpoint = environment.API_ENDPOINT;

        const apiRequest = req.clone({
            url: this.fixUrl(req.url)
        });

        return next.handle(apiRequest);
    }

    private fixUrl(url: string): string {
        if (url.indexOf('http://') >= 0 || url.indexOf('https//') >= 0) {
            return this.cleanUrl(url);
        } else {
            return this.cleanUrl(environment.API_ENDPOINT + url);
        }
    }

    private cleanUrl(url: string): string {
        return url.replace(/([^:]\/)\/+/g, '$1');
    }

}
