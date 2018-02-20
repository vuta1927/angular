import {
    serializable,
    DynamicFormControlModelType,
    DynamicFormControlClsConfig,
    DynamicFormGroupModel,
    DynamicFormGroupModelConfig
} from 'app/shared/form/core';

export class DynamicRowModel extends DynamicFormGroupModel {
    @serializable() public readonly type: string = DynamicFormControlModelType.ROW;

    constructor(config: DynamicFormGroupModelConfig, clsConfig?: DynamicFormControlClsConfig) {
        super(config, clsConfig);
    }
}
