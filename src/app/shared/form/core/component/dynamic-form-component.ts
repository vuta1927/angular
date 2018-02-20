import { EventEmitter, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    DynamicFormControlComponent,
    DynamicFormControlEvent,
    DYNAMIC_FORM_CONTROL_EVENT_TYPE_BLUR,
    DYNAMIC_FORM_CONTROL_EVENT_TYPE_CHANGE,
    DYNAMIC_FORM_CONTROL_EVENT_TYPE_FOCUS,
    DYNAMIC_FORM_CONTROL_EVENT_TYPE_CUSTOM
} from './dynamic-form-control.component';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicTemplateDirective } from '../directive/dynamic-template.directive';
import { DynamicFormService } from '../service/dynamic-form.service';
import {
    DynamicFormControlLayout,
    DynamicFormLayout,
    DynamicFormLayoutService
} from '../service/dynamic-form-layout.service';

export abstract class DynamicFormComponent {

    public group: FormGroup;
    public model: DynamicFormControlModel[];
    public layout: DynamicFormLayout;

    public components: QueryList<DynamicFormControlComponent>;
    public templates: QueryList<DynamicTemplateDirective>;

    public blur: EventEmitter<DynamicFormControlEvent>;
    public change: EventEmitter<DynamicFormControlEvent>;
    public focus: EventEmitter<DynamicFormControlEvent>;
    public customEvent: EventEmitter<DynamicFormControlEvent>;

    constructor(
        protected formService: DynamicFormService,
        protected layoutService: DynamicFormLayoutService) { }

    public trackByFn(_index: number, model: DynamicFormControlModel): string {
        return model.id;
    }

    public getClass(model: DynamicFormControlModel, context: string, place: string): string {

        const controlLayout = this.layoutService.findById(model.id, this.layout) ||
            model.cls as DynamicFormControlLayout;

        return this.layoutService.getClass(controlLayout, context, place);
    }

    public onEvent($event: DynamicFormControlEvent, type: string) {

        switch (type) {

            case DYNAMIC_FORM_CONTROL_EVENT_TYPE_BLUR:
                this.blur.emit($event);
                break;

            case DYNAMIC_FORM_CONTROL_EVENT_TYPE_CHANGE:
                this.change.emit($event);
                break;

            case DYNAMIC_FORM_CONTROL_EVENT_TYPE_FOCUS:
                this.focus.emit($event);
                break;

            case DYNAMIC_FORM_CONTROL_EVENT_TYPE_CUSTOM:
                this.customEvent.emit($event);
                break;
        }
    }
}
