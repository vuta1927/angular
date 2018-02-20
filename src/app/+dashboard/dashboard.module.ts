import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { routing } from './dashboard.routing';
import { AnalyticsComponent } from './analytics/analytics.component';

@NgModule({
    declarations: [
      AnalyticsComponent
    ],
    imports: [
        SharedModule,
        routing
    ]
})
export class DashboardModule {}
