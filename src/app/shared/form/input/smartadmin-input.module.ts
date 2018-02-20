import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDatepickerDirective } from './directive/ui-datepicker.directive';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        UiDatepickerDirective
    ],
    exports: [
        UiDatepickerDirective
    ]
})
export class SmartadminInputModule {}
