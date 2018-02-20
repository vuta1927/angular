import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './+login/login.component';
import { RegisterComponent } from 'app/+account/+register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'forgot-password', loadChildren: './+forgot/forgot.module#ForgotModule' },
  // { path: 'locked', loadChildren: './+locked/locked.module#LockedModule' }
];

export const routing = RouterModule.forChild(routes);
