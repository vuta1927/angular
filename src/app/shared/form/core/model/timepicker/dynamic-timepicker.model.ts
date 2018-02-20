import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import {
    DynamicDateControlModel,
    DynamicDateControlModelConfig
} from '../dynamic-date-control.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicTimePickerModelConfig extends DynamicDateControlModelConfig {

    meridian?: boolean;
    showSeconds?: boolean;
}

export class DynamicTimePickerModel extends DynamicDateControlModel {

    @serializable() public meridian: boolean;
    @serializable() public showSeconds: boolean;

    @serializable() public readonly type: string = DynamicFormControlModelType.TIMEPICKER;

    constructor(config: DynamicTimePickerModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.meridian = typeof config.meridian === 'boolean' ? config.meridian : false;
        this.showSeconds = typeof config.showSeconds === 'boolean' ? config.showSeconds : false;
    }
}
