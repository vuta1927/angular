import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { DatabaseService } from './database.service';

@Injectable()
export class AppService {
    constructor(
        public auth: AuthService,
        public database: DatabaseService,
        public user: UserService
    ) {}
}

export const AppServiceProvider: any[] = [
    AppService,
    AuthService,
    DatabaseService,
    UserService
];
