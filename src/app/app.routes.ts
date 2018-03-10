import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/app-layout/main-layout.component';
import { AuthLayoutComponent } from './shared/layout/app-layout/auth-layout.component';
import { AuthGuard, MapGuard } from 'app/core/guards/auth.guard';
import { NotFoundComponent } from './not-found';

export const ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    data: { pageTitle: 'Home' },
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'map', pathMatch: 'full' },
    ]
  },
  {
    path: 'map',
    component: MainLayoutComponent,
    data: { pageTitle: 'Map' },
    canActivate: [AuthGuard, MapGuard],
    children:[
      {
        path: '',
        loadChildren: 'app/+map/map.module#MapModule',
        data: { pageTitle: 'Home' },
      }
    ]
  },

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: 'app/+account/account.module#AccountModule'
  },
  { path: '**', component: NotFoundComponent }
];
