import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicCheckControlModel,
    DynamicCheckControlModelConfig
} from '../dynamic-check-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicSwitchModelConfig extends DynamicCheckControlModelConfig {

    offLabel?: string;
    onLabel?: string;
}

export class DynamicSwitchModel extends DynamicCheckControlModel {

    @serializable() public offLabel: string | null;
    @serializable() public onLabel: string | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.SWITCH;

    constructor(config: DynamicSwitchModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.offLabel = config.offLabel || null;
        this.onLabel = config.onLabel || null;
    }
}
