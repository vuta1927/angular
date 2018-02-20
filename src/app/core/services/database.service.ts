import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable()
export class DatabaseService {
    constructor(private http: HttpClient) {}

    public databaseSchema(schemaId: string): HttpService {
        return new HttpService(schemaId, this.http);
    }
}
