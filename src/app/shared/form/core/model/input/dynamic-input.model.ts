import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicInputControlModel,
    DynamicInputControlModelConfig
} from '../dynamic-input-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { Utils } from '../../utils/core.utils';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export type DynamicFormControlInputType =
    'color' |
    'date' |
    'datetime-local' |
    'email' |
    'file' |
    'month' | 'number' | 'password' | 'range' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week';

export interface DynamicInputModelConfig
    extends DynamicInputControlModelConfig<string | number | Date | string[]> {

    accept?: string;
    inputType?: DynamicFormControlInputType;
    list?: string[];
    mask?: string | RegExp | Array<string | RegExp>;
    max?: number | string | Date;
    min?: number | string | Date;
    multiple?: boolean;
    pattern?: string;
    step?: number;
}

export class DynamicInputModel extends DynamicInputControlModel<string | number | Date | string[]> {

    @serializable() public accept: string | null;
    @serializable() public inputType: DynamicFormControlInputType;
    public files: FileList | null = null;
    @serializable() public list: string[] | null;
    @serializable() public mask: string | RegExp | Array<string | RegExp> | null;
    @serializable() public max: number | string | Date | null;
    @serializable() public min: number | string | Date | null;
    @serializable() public multiple: boolean | null;
    @serializable() public pattern: string | null;
    @serializable() public step: number | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.INPUT;

    private listId: string | null = null;

    constructor(config: DynamicInputModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.accept = config.accept || null;
        this.inputType = config.inputType || 'text';
        this.list = Array.isArray(config.list) ? config.list : null;
        this.mask = config.mask || null;
        this.max = config.max !== undefined ? config.max : null;
        this.min = config.min !== undefined ? config.min : null;
        this.multiple = typeof config.multiple === 'boolean' ? config.multiple : null;
        this.pattern = config.pattern || null;
        this.step = typeof config.step === 'number' ? config.step : null;

        if (this.list) {
            this.listId = `${this.id}List`;
        }
    }

    public toJSON() {

        const json: any = super.toJSON();

        if (this.mask !== null) { json.mask = Utils.maskToString(this.mask); }

        return json;
    }
}
