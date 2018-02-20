import { DynamicFormControlClsConfig } from './dynamic-form-control.model';
import {
    DynamicFormValueControlModel,
    DynamicFormValueControlModelConfig
} from './dynamic-form-value-control.model';
import { serializable } from '../decorator/serializable.decorator';
import { AUTOCOMPLETE_ON } from '../utils/autofill.utils';

export interface DynamicInputControlModelConfig<T> extends DynamicFormValueControlModelConfig<T> {

    autoComplete?: string;
    autoFocus?: boolean;
    maxLength?: number;
    minLength?: number;
    placeholder?: string;
    prefix?: string;
    readOnly?: boolean;
    spellCheck?: boolean;
    suffix?: string;
}

export abstract class DynamicInputControlModel<T> extends DynamicFormValueControlModel<T> {

    @serializable() public autoComplete: string;
    @serializable() public autoFocus: boolean;
    @serializable() public maxLength: number | null;
    @serializable() public minLength: number | null;
    @serializable() public placeholder: string;
    @serializable() public prefix: string | null;
    @serializable() public readOnly: boolean;
    @serializable() public spellCheck: boolean;
    @serializable() public suffix: string | null;

    constructor(
        config: DynamicInputControlModelConfig<T>, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.autoComplete = config.autoComplete || AUTOCOMPLETE_ON;
        this.autoFocus = typeof config.autoFocus === 'boolean' ? config.autoFocus : false;
        this.maxLength = typeof config.maxLength === 'number' ? config.maxLength : null;
        this.minLength = typeof config.minLength === 'number' ? config.minLength : null;
        this.placeholder = config.placeholder || '';
        this.prefix = config.prefix || null;
        this.readOnly = typeof config.readOnly === 'boolean' ? config.readOnly : false;
        this.spellCheck = typeof config.spellCheck === 'boolean' ? config.spellCheck : false;
        this.suffix = config.suffix || null;
    }
}
