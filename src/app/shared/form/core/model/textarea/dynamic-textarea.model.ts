import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicInputControlModel,
    DynamicInputControlModelConfig
} from '../dynamic-input-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export const DYNAMIC_FORM_TEXTAREA_WRAP_HARD = 'hard';
export const DYNAMIC_FORM_TEXTAREA_WRAP_SOFT = 'soft';

export interface DynamicTextAreaModelConfig extends DynamicInputControlModelConfig<string> {

    cols?: number;
    rows?: number;
    wrap?: string;
}

export class DynamicTextAreaModel extends DynamicInputControlModel<string> {

    @serializable() public cols: number;
    @serializable() public rows: number;
    @serializable() public wrap: string;

    @serializable() public readonly type: string = DynamicFormControlModelType.TEXTAREA;

    constructor(config: DynamicTextAreaModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.cols = typeof config.cols === 'number' ? config.cols : 20;
        this.rows = typeof config.rows === 'number' ? config.rows : 2;
        this.wrap = config.wrap || DYNAMIC_FORM_TEXTAREA_WRAP_SOFT;
    }
}
