import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  SimpleChanges,
  ContentChildren,
  QueryList
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormControlComponent,
  DynamicFormArrayGroupModel,
  DynamicTemplateDirective,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormControlModelType,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicFormLayout,
  DynamicFormGroupModel
} from '../core';
import * as _ from 'lodash';
import { NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlValue } from 'app/shared/form/core/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
const now = new Date();
@Component({
  selector: 'dynamic-smart-form-control',
  templateUrl: './dynamic-smart-form-control.component.html'
})
export class DynamicSmartFormControlComponent
  extends DynamicFormControlComponent implements OnChanges {
  public static getFormControlType(model: DynamicFormControlModel): string | null {
    switch (model.type) {
      case DynamicFormControlModelType.ARRAY:
        return 'array';
      case DynamicFormControlModelType.CHECKBOX:
        return 'checkbox';
      case DynamicFormControlModelType.CHECKBOX_GROUP:
      case DynamicFormControlModelType.GROUP:
        return 'group';
      case DynamicFormControlModelType.DATEPICKER:
        return 'datepicker';
      case DynamicFormControlModelType.INPUT:
        return 'input';
      case DynamicFormControlModelType.RADIO_GROUP:
        return 'radio';
      case DynamicFormControlModelType.ROW:
        return 'row';
      case DynamicFormControlModelType.SELECT:
        return 'select';
      case DynamicFormControlModelType.TEXTAREA:
        return 'textarea';
      default:
        return null;
    }
  }

  public date: { year: number, month: number };

  @ContentChildren(DynamicTemplateDirective)
  public contentTemplateList: QueryList<DynamicTemplateDirective>;

  // tslint:disable-next-line:no-input-rename
  @Input('templates') public inputTemplateList: QueryList<DynamicTemplateDirective>;

  @Input() public bindId: boolean = true;
  @Input() public context: DynamicFormArrayGroupModel = null;
  @Input() public group: FormGroup;
  @Input() public hasErrorMessaging: boolean = false;
  @Input() public layout: DynamicFormLayout;
  @Input() public model: DynamicFormControlModel;
  @Input() public dateModel: NgbDateStruct;

  // tslint:disable-next-line:no-output-rename
  @Output('dfBlur')
  public blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  // tslint:disable-next-line:no-output-rename
  @Output('dfChange')
  // tslint:disable-next-line:max-line-length
  public change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  // tslint:disable-next-line:no-output-rename
  @Output('dfFocus')
  public focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  public type: string | null;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected layoutService: DynamicFormLayoutService,
    protected validationService: DynamicFormValidationService) {
    super(changeDetectorRef, layoutService, validationService);
  }

  public selectToday() {
    this.dateModel = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model']) {
      this.type = DynamicSmartFormControlComponent.getFormControlType(this.model);
    }
  }

  public pickDate(date: NgbDateStruct, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.control.patchValue(date);
  }

  public onControlValueChanges(value: DynamicFormControlValue) {
    super.onControlValueChanges(value);
    if (this.dateModel) {
      // this.dateModel.close();
    }
  }
}
