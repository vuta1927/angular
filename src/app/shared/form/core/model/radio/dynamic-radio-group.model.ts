import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicOptionControlModel,
    DynamicOptionControlModelConfig
} from '../dynamic-option-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicRadioGroupModelConfig<T> extends DynamicOptionControlModelConfig<T> {

    legend?: string;
}

export class DynamicRadioGroupModel<T> extends DynamicOptionControlModel<T> {

    @serializable() public legend: string | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.RADIO_GROUP;

    constructor(config: DynamicRadioGroupModelConfig<T>, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.legend = config.legend || null;
    }

    public select(index: number): void {
        this.valueUpdates.next(this.get(index).value);
    }
}
