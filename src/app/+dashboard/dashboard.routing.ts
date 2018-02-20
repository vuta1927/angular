import { Routes, RouterModule } from '@angular/router';
import { AnalyticsComponent } from 'app/+dashboard/analytics/analytics.component';

export const routes: Routes = [
    { path: '', redirectTo: 'analytics', pathMatch: 'full' },
    { path: 'analytics', component: AnalyticsComponent }
];

export const routing = RouterModule.forChild(routes);
