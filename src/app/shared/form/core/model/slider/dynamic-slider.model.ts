import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicFormValueControlModelConfig,
    DynamicFormValueControlModel
} from '../dynamic-form-value-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicSliderModelConfig extends DynamicFormValueControlModelConfig<number> {

    max?: number;
    min?: number;
    step?: number;
    vertical?: boolean;
}

export class DynamicSliderModel extends DynamicFormValueControlModel<number> {

    @serializable() public max: number | null;
    @serializable() public min: number | null;
    @serializable() public step: number | null;
    @serializable() public vertical: boolean;

    @serializable() public readonly type: string = DynamicFormControlModelType.SLIDER;

    constructor(config: DynamicSliderModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.max = typeof config.max === 'number' ? config.max : 10;
        this.min = typeof config.min === 'number' ? config.min : 0;
        this.step = typeof config.step === 'number' ? config.step : 1;
        this.vertical = typeof config.vertical === 'boolean' ? config.vertical : false;
    }
}
