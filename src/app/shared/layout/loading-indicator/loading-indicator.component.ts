import { Component, OnDestroy } from '@angular/core';

import { SpinnerService } from '../../../core/services/spinner.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent {
  public isSpinnerVisible: boolean;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.state.subscribe((response: boolean) => {
      this.isSpinnerVisible = response;
    });
  }
}
