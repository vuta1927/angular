import { FormHooks } from '@angular/forms/src/model';
import { Subject } from 'rxjs/Subject';
import { DynamicFormControlRelationGroup } from './dynamic-form-control-relation.model';
import { serializable, serialize } from '../decorator/serializable.decorator';

// tslint:disable-next-line:interface-over-type-literal
export type DynamicValidatorsConfig = { [validatorKey: string]: any | DynamicValidatorDescriptor };

export class DynamicFormControlModelType {
    public static ARRAY = 'ARRAY';
    public static CHECKBOX = 'CHECKBOX';
    public static CHECKBOX_GROUP = 'CHECKBOX_GROUP';
    public static GROUP = 'GROUP';
    public static DATEPICKER = 'DATEPICKER';
    public static EDITOR = 'EDITOR';
    public static FILE_UPLOAD = 'FILE_UPLOAD';
    public static INPUT = 'INPUT';
    public static RADIO_GROUP = 'RADIO_GROUP';
    public static RATING = 'RATING';
    public static ROW = 'ROW';
    public static SELECT = 'SELECT';
    public static SLIDER = 'SLIDER';
    public static SWITCH = 'SWITCH';
    public static TEXTAREA = 'TEXTAREA';
    public static TIMEPICKER = 'TIMEPICKER';
}

export interface DynamicValidatorDescriptor {

    name: string;
    args: any;
}

export interface DynamicPathable {

    id?: string;
    index?: number | null;
    parent: DynamicPathable | null;
}

export interface DynamicClsConfig {

    container?: string;
    control?: string;
    errors?: string;
    group?: string;
    hint?: string;
    host?: string;
    label?: string;
    option?: string;
}

export interface DynamicFormControlClsConfig {

    element?: DynamicClsConfig;
    grid?: DynamicClsConfig;
}

export interface DynamicFormControlModelConfig {

    asyncValidators?: DynamicValidatorsConfig;
    disabled?: boolean;
    errorMessages?: DynamicValidatorsConfig;
    id: string;
    icon?: string;
    label?: string;
    name?: string;
    relation?: DynamicFormControlRelationGroup[];
    updateOn?: FormHooks;
    validators?: DynamicValidatorsConfig;
}

// tslint:disable-next-line:max-classes-per-file
export abstract class DynamicFormControlModel implements DynamicPathable {

    public static isValidatorDescriptor(value: any): boolean {

        if (value !== null && typeof value === 'object') {
            return value.hasOwnProperty('name') && value.hasOwnProperty('args');
        }

        return false;
    }

    @serializable() public asyncValidators: DynamicValidatorsConfig | null;
    @serializable() public cls: DynamicFormControlClsConfig | null;
    @serializable() public errorMessages: DynamicValidatorsConfig | null;
    @serializable() public id: string;
    @serializable() public icon: string | null;
    @serializable() public label: string | null;
    @serializable() public name: string;
    public parent: DynamicPathable | null = null;
    @serializable() public relation: DynamicFormControlRelationGroup[];
    @serializable() public updateOn: FormHooks | null;
    @serializable() public validators: DynamicValidatorsConfig | null;

    public abstract readonly type: string;

    public disabledUpdates: Subject<boolean>;
    @serializable('disabled') private _disabled: boolean;

    constructor(
        config: DynamicFormControlModelConfig,
        clsConfig: DynamicFormControlClsConfig | null = null) {

        this.asyncValidators = config.asyncValidators || null;
        this.cls = clsConfig;
        this.errorMessages = config.errorMessages || null;
        this.id = config.id;
        this.icon = config.icon || null;
        this.label = config.label || null;
        this.name = config.name || config.id;
        this.relation = Array.isArray(config.relation) ? config.relation : [];
        this.updateOn = typeof config.updateOn === 'string' ? config.updateOn : null;
        this.validators = config.validators || null;

        this.disabled = typeof config.disabled === 'boolean' ? config.disabled : false;
        this.disabledUpdates = new Subject<boolean>();
        this.disabledUpdates.subscribe((value: boolean) => this.disabled = value);
    }

    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value: boolean) {
        this._disabled = value;
    }

    get hasErrorMessages(): boolean {
        return typeof this.errorMessages === 'object' && this.errorMessages !== null;
    }

    public toJSON() {
        return serialize(this);
    }
}
