import { Subject } from 'rxjs/Subject';
import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicFormControlClsConfig
} from './dynamic-form-control.model';
import { serializable } from '../decorator/serializable.decorator';

export type DynamicFormControlValue = boolean | number | string | object | Date |
    Array<boolean | number | string | object>;

export type HintPosition =
    'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface HintConfig {
    text: string;
    icon?: string;
    position: HintPosition;
}

export interface DynamicFormValueControlModelConfig<T> extends DynamicFormControlModelConfig {

    additional?: { [key: string]: any };
    hint?: HintConfig;
    required?: boolean;
    tabIndex?: number;
    value?: T;
}

export abstract class DynamicFormValueControlModel<T> extends DynamicFormControlModel {

    @serializable() public additional: { [key: string]: any } | null;
    @serializable() public hint: HintConfig | null;
    @serializable() public required: boolean;
    @serializable() public tabIndex: number | null;
    @serializable('value') public _value: T | null;
    public valueUpdates: Subject<T>;

    constructor(
        config: DynamicFormValueControlModelConfig<T>, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.additional = typeof config.additional === 'object' && config.additional !== null
            ? config.additional
            : null;
        this.hint = config.hint || null;
        this.required = typeof config.required === 'boolean' ? config.required : false;
        this.tabIndex = config.tabIndex || null;

        this.value = config.value || null;
        this.valueUpdates = new Subject<T>();
        this.valueUpdates.subscribe((value: T) => this.value = value);
    }

    set value(value: T | null) {
        this._value = value;
    }

    get value(): T | null {
        return this._value;
    }
}
