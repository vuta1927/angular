import { ApplicationRef, ErrorHandler, Injector, Injectable } from '@angular/core';
import { NotificationService } from 'app/shared/utils/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private notification: NotificationService, private injector: Injector) {}

    public handleError(errorResponse: any): void {
        if (errorResponse.status === 401) {
            this.notification.smallBox({
                title: 'Unauthorised',
                content: 'Please login again!',
                icon: 'fa fa-lock'
            });

            this.injector.get(ApplicationRef).tick();
        } else if (errorResponse.status === 400) {

            this.notification.smallBox({
                title: errorResponse.error.message,
                content: this.formatErrors(errorResponse.error.errors),
                icon: 'fa fa-exclamation-triangle'
            });
            this.injector.get(ApplicationRef).tick();
        }

        this.notification.smallBox({
            content: errorResponse
        });
    }

    private formatErrors(errors: any) {
        return errors ? errors.map((err: any) => err.message).join('/n') : '';
    }
}
