import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    selector: 'app-ribbon',
    templateUrl: './ribbon.component.html'
})
export class RibbonComponent {
    constructor(private layoutService: LayoutService) {}

    public resetWidgets() {
        this.layoutService.factoryReset();
    }
}
