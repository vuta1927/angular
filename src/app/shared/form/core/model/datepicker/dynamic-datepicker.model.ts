import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import {
    DynamicDateControlModel,
    DynamicDateControlModelConfig,
    DynamicDateControlValue
} from '../dynamic-date-control.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicDatePickerModelConfig extends DynamicDateControlModelConfig {

    focusedDate?: DynamicDateControlValue;
    inline?: boolean;
    toggleIcon?: string;
}

export class DynamicDatePickerModel extends DynamicDateControlModel {

    @serializable() public focusedDate: DynamicDateControlValue | null;
    @serializable() public inline: boolean;
    @serializable() public toggleIcon: string | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.DATEPICKER;

    constructor(config: DynamicDatePickerModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.focusedDate = config.focusedDate || null;
        this.inline = typeof config.inline === 'boolean' ? config.inline : false;
        this.toggleIcon = typeof config.toggleIcon === 'string' ? config.toggleIcon : null;
    }
}
