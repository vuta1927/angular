import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicFormControlClsConfig
} from '../dynamic-form-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicFormGroupModelConfig extends DynamicFormControlModelConfig {

    group?: DynamicFormControlModel[];
    legend?: string;
}

export class DynamicFormGroupModel extends DynamicFormControlModel {

    @serializable() public group: DynamicFormControlModel[] = [];
    @serializable() public legend: string | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.GROUP;

    constructor(config: DynamicFormGroupModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.group = Array.isArray(config.group) ? config.group : [];
        this.legend = config.legend || null;
    }

    public get(index: number): DynamicFormControlModel {
        return this.group[index];
    }

    public set(index: number, controlModel: DynamicFormControlModel): void {
        this.group[index] = controlModel;
    }

    public add(controlModel: DynamicFormControlModel): void {
        this.group.push(controlModel);
    }

    public insert(index: number, controlModel: DynamicFormControlModel): void {
        this.group.splice(index, 0, controlModel);
    }

    public move(index: number, step: number): void {
        this.group.splice(index + step, 0, ...this.group.splice(index, 1));
    }

    public remove(index: number) {
        this.group.splice(index, 1);
    }

    public size(): number {
        return this.group.length;
    }
}
