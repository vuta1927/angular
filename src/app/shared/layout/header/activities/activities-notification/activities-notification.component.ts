import { Component, Input } from '@angular/core';

@Component({
  selector: '[activitiesNotification]',
  templateUrl: './activities-notification.component.html',
})
export class ActivitiesNotificationComponent {

  @Input() public item: any;

  public setClasses() {
    const classes = {
      'fa fa-fw fa-2x': true
    };
    classes[this.item.icon] = true;
    return classes;
  }

}
