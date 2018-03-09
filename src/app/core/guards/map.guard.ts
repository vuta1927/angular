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
import { AuthService } from '../services/auth.service';
@Injectable()
export class MapGuard implements CanActivate, CanLoad {
    viewPermission = 'ViewMap';
    constructor(private router: Router, private authService: AuthService) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // const url: string = state.url;
        return this.checkPermission();
    }

    public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    public canLoad(route: Route): boolean {
        // const url = `/${route.path}`;
        return this.checkPermission();
    }

    private checkPermission(): boolean {
        var claims = this.authService.getClaim();
        if(claims.indexOf(this.viewPermission) > -1){
            return true;
        }
        return false;
    }
}