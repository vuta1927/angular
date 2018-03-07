import { OnDestroy, Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateChild,
    CanLoad,
    Router,
    RouterStateSnapshot,
    CanActivate,
    Route
} from '@angular/router';

@Injectable()
export class MapGuard implements CanActivate, CanLoad {

    constructor(private router: Router) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        return this.checkLogin(url);
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    public canLoad(route: Route): boolean {
        const url = `/${route.path}`;
        return this.checkLogin(url);
    }

    private checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn) {
            return true;
        }

        this.router.navigate(['/auth/login'], {queryParams: { returnUrl: url }});

        return false;
    }
}