import { Component } from '@angular/core';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'app-collapse-menu',
  templateUrl: './collapse-menu.component.html'
})
export class CollapseMenuComponent {

  constructor(private layoutService: LayoutService) {}

  public onToggle() {
    this.layoutService.onCollapseMenu();
  }
}
