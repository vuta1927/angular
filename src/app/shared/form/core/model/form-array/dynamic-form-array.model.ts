import {
    DynamicFormControlModel,
    DynamicFormControlModelConfig,
    DynamicPathable,
    DynamicValidatorsConfig,
    DynamicFormControlClsConfig
} from '../dynamic-form-control.model';
import { serializable, serialize } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export class DynamicFormArrayGroupModel implements DynamicPathable {

    public $implicit: DynamicFormArrayGroupModel;
    public context: DynamicFormArrayModel;
    @serializable() public group: DynamicFormControlModel[];
    @serializable() public index: number;

    constructor(
        context: DynamicFormArrayModel,
        group: DynamicFormControlModel[] = [],
        index: number = -1) {

        this.$implicit = this;
        this.context = context;
        this.group = group;
        this.index = index;
    }

    get parent(): DynamicFormArrayModel {
        return this.context;
    }

    public get(index: number): DynamicFormControlModel {
        return this.group[index];
    }

    public toJSON() {
        return serialize(this);
    }
}

export interface DynamicFormArrayModelConfig extends DynamicFormControlModelConfig {

    groupAsyncValidators?: DynamicValidatorsConfig;
    groupFactory?: () => DynamicFormControlModel[];
    groupValidators?: DynamicValidatorsConfig;
    groups?: DynamicFormArrayGroupModel[] | null;
    initialCount?: number;
}

// tslint:disable-next-line:max-classes-per-file
export class DynamicFormArrayModel extends DynamicFormControlModel {

    @serializable() public groupAsyncValidators: DynamicValidatorsConfig | null;
    public groupFactory: () => DynamicFormControlModel[];
    @serializable() public groupValidators: DynamicValidatorsConfig | null;
    @serializable() public groups: DynamicFormArrayGroupModel[] = [];
    @serializable() public initialCount: number;

    // only to recreate model from JSON
    @serializable() public readonly groupPrototype: DynamicFormControlModel[];
    // deprecated - only for backwards compatibility;
    public readonly origin: DynamicFormControlModel[];
    @serializable() public readonly type: string = DynamicFormControlModelType.ARRAY;

    constructor(config: DynamicFormArrayModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        if (typeof config.groupFactory === 'function') {
            this.groupFactory = config.groupFactory;
        } else {
            throw new Error('group factory function must be specified for DynamicFormArrayModel');
        }

        this.groupAsyncValidators = config.groupAsyncValidators || null;
        this.groupPrototype = this.groupFactory();
        this.groupValidators = config.groupValidators || null;
        this.initialCount = typeof config.initialCount === 'number' ? config.initialCount : 1;

        if (Array.isArray(config.groups)) {

            config.groups.forEach((arrayGroup, index) => {
                this.groups.push(
                    new DynamicFormArrayGroupModel(
                        this, arrayGroup.group, arrayGroup.index || index));
            });

        } else {

            for (let index = 0; index < this.initialCount; index++) {
                this.addGroup();
            }
        }
    }

    get size(): number {
        return this.groups.length;
    }

    public get(index: number): DynamicFormArrayGroupModel {
        return this.groups[index];
    }

    public addGroup(): DynamicFormArrayGroupModel {
        return this.insertGroup(this.groups.length);
    }

    public insertGroup(index: number): DynamicFormArrayGroupModel {

        const group = new DynamicFormArrayGroupModel(this, this.groupFactory());

        this.groups.splice(index, 0, group);
        this.updateGroupIndex();

        return group;
    }

    public moveGroup(index: number, step: number): void {

        this.groups.splice(index + step, 0, ...this.groups.splice(index, 1));
        this.updateGroupIndex();
    }

    public removeGroup(index: number): void {

        this.groups.splice(index, 1);
        this.updateGroupIndex();
    }

    private updateGroupIndex(): void {
        this.groups.forEach((group, index) => group.index = index);
    }
}
