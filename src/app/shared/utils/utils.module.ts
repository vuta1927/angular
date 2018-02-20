import { NgModule } from '@angular/core';
import { NotificationService } from './notification.service';

@NgModule({
    providers: [
        NotificationService
    ]
})
export class UtilsModule {
    public static forRoot() {
        return {
            ngModule: UtilsModule,
            providers: [
                NotificationService
            ]
        };
    }
}
