import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface QueryParams {
    id: any;
    pageSize?: number;
    pageNumber?: number;
    filter?: string;
    sort?: string;
    deep?: boolean;
    meta?: boolean;
}

export class HttpService {

    constructor(private url: string, private http: HttpClient) { }

    public get<T>(params?: QueryParams): Observable<T>;
    public get<T>(params?: any): Observable<T> {
        return this.http.get<T>(this.url, { params: this.buildUrlSearchParams(params) });
    }

    public post<T>(data?: any, params?: any): Observable<T> {
        return this.http.post<T>(this.url, data, { params: this.buildUrlSearchParams(params) });
    }

    public put<T>(data?: any, params?: any): Observable<T> {
        return this.http.put<T>(this.url, data);
    }

    public delete<T>(id: string): Observable<T> {
        return this.http.delete<T>(this.url, { params: this.buildUrlSearchParams({id}) });
    }

    private buildUrlSearchParams(params: any): HttpParams {
        const searchParams = new HttpParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                searchParams.append(key, params[key]);
            }
        }
        return searchParams;
    }
}
