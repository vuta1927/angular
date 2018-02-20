import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicFormValueControlModelConfig,
    DynamicFormValueControlModel
} from '../dynamic-form-value-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from 'app/shared/form/core/core';

export interface DynamicRatingModelConfig extends DynamicFormValueControlModelConfig<number> {

    max?: number;
}

export class DynamicRatingModel extends DynamicFormValueControlModel<number> {

    @serializable() public max: number | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.RATING;

    constructor(config: DynamicRatingModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.max = typeof config.max === 'number' ? config.max : 10;
    }
}
