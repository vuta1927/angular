import { Component, transition } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../utils/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'app/core';

declare var $: any;

@Component({
  selector: 'sa-logout',
  template: `
<div id="logout" (click)="showPopup()" class="btn-header transparent pull-right">
        <span> <a routerlink="/auth/login" title="{{ 'Sign Out' | translate }}"
        data-action="userLogout"
                  data-logout-msg="You can improve your security further after
                  logging out by closing this opened browser"><i
          class="fa fa-sign-out"></i></a> </span>
    </div>
  `,
  styles: []
})
export class LogoutComponent {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private accountService: AuthService) { }

  public showPopup() {
    let title: string;
    let content: string;
    let buttons: string;
    this.translateService.get(['Logout', 'LogoutContent', 'LogoutButtons']).subscribe((res) => {
      title = res['Logout'];
      content = res['LogoutContent'];
      buttons = res['LogoutButtons'];
    });
    this.notificationService.smartMessageBox({
      // tslint:disable-next-line:max-line-length
      title: `<i class="fa fa-sign-out txt-color-orangeDark"></i> ${title} <span class="txt-color-orangeDark"><strong>` + $('#show-shortcut').text() + '</strong></span> ?',
      // tslint:disable-next-line:max-line-length
      content: `${content}`,
      buttons: `${buttons}`

    }, (ButtonPressed) => {
      if (ButtonPressed === 'Yes') {
        this.logout();
      }
    });
  }

  public logout() {
    this.accountService.logout();
  }
}
