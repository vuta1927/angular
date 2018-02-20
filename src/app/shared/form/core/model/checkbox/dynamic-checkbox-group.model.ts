import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicFormGroupModel,
    DynamicFormGroupModelConfig
} from '../form-group/dynamic-form-group.model';
import { DynamicCheckboxModel } from './dynamic-checkbox.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from 'app/shared/form/core/core';

export class DynamicCheckboxGroupModel extends DynamicFormGroupModel {

    @serializable() public group: DynamicCheckboxModel[];

    @serializable() public readonly type: string = DynamicFormControlModelType.CHECKBOX_GROUP;

    constructor(config: DynamicFormGroupModelConfig, clsConfig?: DynamicFormControlClsConfig) {
        super(config, clsConfig);
    }

    public check(...indices: number[]): void {
        indices.forEach((index) => this.group[index].checked = true);
    }

    public uncheck(...indices: number[]): void {
        indices.forEach((index) => this.group[index].checked = false);
    }

    public checkAll(): void {
        this.group.forEach((model) => model.checked = true);
    }

    public uncheckAll(): void {
        this.group.forEach((model) => model.checked = false);
    }
}
