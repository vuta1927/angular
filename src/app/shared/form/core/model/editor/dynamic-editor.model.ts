import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicInputControlModel,
    DynamicInputControlModelConfig
} from '../dynamic-input-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicEditorModelConfig extends DynamicInputControlModelConfig<string> {
}

export class DynamicEditorModel extends DynamicInputControlModel<string> {

    @serializable() public readonly type: string = DynamicFormControlModelType.EDITOR;

    constructor(config: DynamicEditorModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);
    }
}
