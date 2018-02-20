import { DynamicFormControlClsConfig } from './dynamic-form-control.model';
import {
    DynamicFormValueControlModelConfig,
    DynamicFormValueControlModel
} from './dynamic-form-value-control.model';
import { serializable } from '../decorator/serializable.decorator';

export interface DynamicFileControlModelConfig
    extends DynamicFormValueControlModelConfig<File | File[]> {

    multiple?: boolean;
}

export abstract class DynamicFileControlModel extends DynamicFormValueControlModel<File | File[]> {

    @serializable() public multiple: boolean;

    constructor(config: DynamicFileControlModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.multiple = typeof config.multiple === 'boolean' ? config.multiple : false;
    }
}
