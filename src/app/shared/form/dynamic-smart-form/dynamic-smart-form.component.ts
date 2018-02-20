import { Input, Component, Output, ContentChildren, EventEmitter, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    DynamicFormComponent,
    DynamicFormControlModel,
    DynamicFormLayout,
    DynamicFormControlEvent,
    DynamicTemplateDirective,
    DynamicFormService,
    DynamicFormLayoutService
} from '../core';
import { DynamicSmartFormControlComponent } from './dynamic-smart-form-control.component';

@Component({
    selector: 'dynamic-smart-form',
    templateUrl: './dynamic-smart-form.component.html'
})
export class DynamicSmartFormComponent extends DynamicFormComponent {
    @Input() public group: FormGroup;
    @Input() public model: DynamicFormControlModel[];
    @Input() public layout: DynamicFormLayout;

    // tslint:disable-next-line:no-output-rename
    @Output('dfBlur')
    // tslint:disable-next-line:max-line-length
    public blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    // tslint:disable-next-line:no-output-rename
    @Output('dfChange')
    // tslint:disable-next-line:max-line-length
    public change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
    // tslint:disable-next-line:no-output-rename
    @Output('dfFocus')
    // tslint:disable-next-line:max-line-length
    public focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

    @ContentChildren(DynamicTemplateDirective)
    public templates: QueryList<DynamicTemplateDirective>;

    @ContentChildren(DynamicSmartFormControlComponent)
    public components: QueryList<DynamicSmartFormControlComponent>;

    constructor(
        protected formService: DynamicFormService,
        protected layoutService: DynamicFormLayoutService) {
        super(formService, layoutService);
    }
}
