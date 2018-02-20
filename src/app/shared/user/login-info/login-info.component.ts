import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { LayoutService } from '../../layout/layout.service';

@Component({

  selector: 'app-login-info',
  templateUrl: './login-info.component.html',
})
export class LoginInfoComponent implements OnInit {

  public user: any;

  constructor(
    private userService: UserService,
    private layoutService: LayoutService) {
  }

  public ngOnInit() {
    this.userService.getLoginInfo().subscribe((user) => {
      this.user = user;
    });

  }

  public toggleShortcut() {
    this.layoutService.onShortcutToggle();
  }
}
