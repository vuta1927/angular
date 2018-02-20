import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicCheckControlModel,
    DynamicCheckControlModelConfig
} from '../dynamic-check-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from 'app/shared/form/core/core';

export interface DynamicCheckboxModelConfig extends DynamicCheckControlModelConfig {

    indeterminate?: boolean;
}

export class DynamicCheckboxModel extends DynamicCheckControlModel {

    @serializable() public indeterminate: boolean;

    @serializable() public readonly type: string = DynamicFormControlModelType.CHECKBOX;

    constructor(config: DynamicCheckboxModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.indeterminate = typeof config.indeterminate === 'boolean'
            ? config.indeterminate
            : false;
    }
}
