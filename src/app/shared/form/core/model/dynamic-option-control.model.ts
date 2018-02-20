import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { DynamicFormControlClsConfig } from './dynamic-form-control.model';
import {
    DynamicFormValueControlModel,
    DynamicFormValueControlModelConfig
} from './dynamic-form-value-control.model';
import { serializable, serialize } from '../decorator/serializable.decorator';

export interface DynamicFormOptionConfig<T> {

    disabled?: boolean;
    label?: string;
    value: T;
}

export class DynamicFormOption<T> {

    @serializable() public disabled: boolean;
    @serializable() public label: string | null;
    @serializable() public value: T;

    constructor(config: DynamicFormOptionConfig<T>) {

        this.disabled = typeof config.disabled === 'boolean' ? config.disabled : false;
        this.label = config.label || null;
        this.value = config.value;
    }

    get text() {
        return this.label;
    }

    set text(text: string | null) {
        this.label = text;
    }

    public toJSON() {
        return serialize(this);
    }
}

export interface DynamicOptionControlModelConfig<T>
    extends DynamicFormValueControlModelConfig<T | T[]> {

    options?: Array<DynamicFormOptionConfig<T>> | Observable<Array<DynamicFormOptionConfig<T>>>;
}

// tslint:disable-next-line:max-classes-per-file
export abstract class DynamicOptionControlModel<T> extends DynamicFormValueControlModel<T | T[]> {

    @serializable('options') public _options: Array<DynamicFormOption<T>> = [];
    public options$: Observable<Array<DynamicFormOption<T>>>;

    constructor(
        config: DynamicOptionControlModelConfig<T>, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.options = config.options;
    }

    set options(options: any) {

        if (Array.isArray(options)) {

            this._options = (options as Array<DynamicFormOptionConfig<T>>).map((optionConfig) => {
                return new DynamicFormOption<T>(optionConfig);
            });

            this.updateOptions$();

        } else if (options instanceof Observable) {

            this.options$ = (options as Observable<Array<DynamicFormOptionConfig<T>>>)
                .map((optionsConfig) => {

                    // tslint:disable-next-line:no-shadowed-variable
                    const options = optionsConfig
                        .map((optionConfig) => new DynamicFormOption<T>(optionConfig));
                    this._options = options;

                    return options;
                });

        } else {

            this.updateOptions$();
        }
    }

    get options(): any {
        return this._options;
    }

    public add(optionConfig: DynamicFormOptionConfig<T>): DynamicFormOption<T> {
        return this.insert(this.options.length, optionConfig);
    }

    public get(index: number): DynamicFormOption<T> {
        return this.options[index];
    }

    public insert(index: number, optionConfig: DynamicFormOptionConfig<T>): DynamicFormOption<T> {

        const option = new DynamicFormOption(optionConfig);

        this.options.splice(index, 0, option);
        this.updateOptions$();

        return option;
    }

    public remove(...indices: number[]): void {

        indices.forEach((index) => this.options.splice(index, 1));
        this.updateOptions$();
    }

    public abstract select(...indices: number[]): void;

    private updateOptions$(): void {
        this.options$ = Observable.of(this.options);
    }
}
