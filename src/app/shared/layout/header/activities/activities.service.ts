import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'app/constants';
import { SpinnerService } from 'app/core/services/spinner.service';

@Injectable()
export class ActivitiesService {

    constructor(private httpClient: HttpClient, private spinnerService: SpinnerService) {}

    public getActivities() {
        this.spinnerService.isEnable = false;
        return this.httpClient
            .get(Constants.ACTIVITIES)
            .finally(() => {
                this.spinnerService.isEnable = true;
            })
            .map((data) => (data['data'] || data));
    }
}
