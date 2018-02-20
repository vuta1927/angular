import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicOptionControlModel,
    DynamicOptionControlModelConfig
} from '../dynamic-option-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicSelectModelConfig<T> extends DynamicOptionControlModelConfig<T> {

    filterable?: boolean;
    multiple?: boolean;
    placeholder?: string;
}

export class DynamicSelectModel<T> extends DynamicOptionControlModel<T> {

    @serializable() public filterable: boolean;
    @serializable() public multiple: boolean;
    @serializable() public placeholder: string;

    @serializable() public readonly type: string = DynamicFormControlModelType.SELECT;

    constructor(config: DynamicSelectModelConfig<T>, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.filterable = typeof config.filterable === 'boolean' ? config.filterable : false;
        this.multiple = typeof config.multiple === 'boolean' ? config.multiple : false;
        this.placeholder = config.placeholder || '';
    }

    public select(...indices: number[]): void {

        const value = this.multiple
            ? indices.map((index) => this.get(index).value)
            : this.get(indices[0]).value;

        this.valueUpdates.next(value);
    }
}
