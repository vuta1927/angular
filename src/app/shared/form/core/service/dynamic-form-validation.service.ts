import { Injectable, Inject, Optional } from '@angular/core';
import {
    AbstractControl,
    AsyncValidatorFn,
    ValidatorFn,
    Validators,
    NG_VALIDATORS,
    NG_ASYNC_VALIDATORS
} from '@angular/forms';
import {
    DynamicFormControlModel,
    DynamicValidatorDescriptor,
    DynamicValidatorsConfig
} from '../model/dynamic-form-control.model';

export type ValidatorFactory = (args: any) => ValidatorFn | AsyncValidatorFn;

export type ValidatorsToken = Array<ValidatorFn | AsyncValidatorFn>;

@Injectable()
export class DynamicFormValidationService {

    // tslint:disable-next-line:no-shadowed-variable
    constructor( @Optional() @Inject(NG_VALIDATORS) private NG_VALIDATORS: ValidatorFn[],
                 @Optional() @Inject(NG_ASYNC_VALIDATORS)
                 // tslint:disable-next-line:no-shadowed-variable
                 private NG_ASYNC_VALIDATORS: AsyncValidatorFn[]) { }

    public getValidator(validatorName: string, validatorArgs: any = null): ValidatorFn {
        return this.getValidatorFn(validatorName, validatorArgs) as ValidatorFn;
    }

    public getAsyncValidator(validatorName: string, validatorArgs: any = null): AsyncValidatorFn {
        return this.getValidatorFn(
            validatorName, validatorArgs, this.NG_ASYNC_VALIDATORS) as AsyncValidatorFn;
    }

    public getValidators(validatorsConfig: DynamicValidatorsConfig): ValidatorFn[] {
        return this.getValidatorFns(validatorsConfig) as ValidatorFn[];
    }

    public getAsyncValidators(asyncValidatorsConfig: DynamicValidatorsConfig): AsyncValidatorFn[] {
        return this.getValidatorFns(
            asyncValidatorsConfig, this.NG_ASYNC_VALIDATORS) as AsyncValidatorFn[];
    }

    public updateValidators(validatorsConfig: DynamicValidatorsConfig | null,
                            control: AbstractControl,
                            model: DynamicFormControlModel): void {

        model.validators = validatorsConfig;

        if (validatorsConfig === null) {

            control.clearValidators();

        } else {
            control.setValidators(this.getValidators(validatorsConfig));
        }
    }

    public updateAsyncValidators(asyncValidatorsConfig: DynamicValidatorsConfig | null,
                                 control: AbstractControl,
                                 model: DynamicFormControlModel): void {

        model.asyncValidators = asyncValidatorsConfig;

        if (asyncValidatorsConfig === null) {

            control.clearAsyncValidators();

        } else {
            control.setAsyncValidators(this.getAsyncValidators(asyncValidatorsConfig));
        }
    }

    public createErrorMessages(control: AbstractControl, model: DynamicFormControlModel): string[] {

        const messages: string[] = [];

        if (typeof model.errorMessages === 'object' && model.errorMessages !== null) {

            const messagesConfig = model.errorMessages as DynamicValidatorsConfig;

            Object.keys(control.errors || {}).forEach((validationErrorKey) => {

                const messageKey = validationErrorKey;

                if (validationErrorKey === 'minlength' || validationErrorKey === 'maxlength') {
                    messageKey.replace('length', 'Length');
                }

                if (messagesConfig.hasOwnProperty(messageKey)) {

                    const validationError = control.getError(validationErrorKey);
                    const messageTemplate = messagesConfig[messageKey] as string;

                    messages.push(
                        this.parseErrorMessageTemplate(messageTemplate, model, validationError)
                    );
                }
            });
        }

        return messages;
    }

    public isFormHook(value: any): boolean {
        return typeof value === 'string' && ['blur', 'change', 'submit'].indexOf(value) !== -1;
    }

    private getValidatorFn(validatorName: string, validatorArgs: any = null,
                           validatorsToken: ValidatorsToken = this.NG_VALIDATORS)
                            : ValidatorFn | AsyncValidatorFn | never {

        let validatorFn: ValidatorFactory | ValidatorFn | AsyncValidatorFn | undefined;

        if (Validators.hasOwnProperty(validatorName)) { // Built-in Angular Validators

            validatorFn = (Validators as any)[validatorName];

        } else if (validatorsToken) { // Custom Validators

            // tslint:disable-next-line:no-shadowed-variable
            validatorFn = validatorsToken.find((validatorFn) => validatorFn.name === validatorName);
        }

        if (validatorFn === undefined) {
            // tslint:disable-next-line:max-line-length
            throw new Error(`validator "${validatorName}" is not provided via NG_VALIDATORS or NG_ASYNC_VALIDATORS`);
        }

        if (validatorArgs !== null) {

            return (validatorFn as ValidatorFactory)(validatorArgs);
        }

        return validatorFn as ValidatorFn | AsyncValidatorFn;
    }

    private getValidatorFns(validatorsConfig: DynamicValidatorsConfig,
                            validatorsToken: ValidatorsToken = this.NG_VALIDATORS)
                                : ValidatorFn[] | AsyncValidatorFn[] {

        let validatorFns: ValidatorFn[] | AsyncValidatorFn[] = [];

        if (validatorsConfig && typeof validatorsConfig === 'object') {

            validatorFns = Object.keys(validatorsConfig).map((validatorConfigKey) => {

                const validatorConfigValue = validatorsConfig[validatorConfigKey];

                if (DynamicFormControlModel.isValidatorDescriptor(validatorConfigValue)) {

                    const descriptor = validatorConfigValue as DynamicValidatorDescriptor;

                    return this.getValidatorFn(descriptor.name, descriptor.args, validatorsToken);
                }

                return this.getValidatorFn(
                    validatorConfigKey,
                    validatorConfigValue,
                    validatorsToken);
            });
        }

        return validatorFns;
    }

    private parseErrorMessageTemplate(template: string,
                                      model: DynamicFormControlModel, error: any = null): string {

        return template.replace(/{{\s*(.+?)\s*}}/mg, (_match: string, expression: string) => {

            let propertySource: any = model;
            let propertyName: string = expression;

            if (expression.indexOf('validator.') >= 0 && error) {

                propertySource = error;
                propertyName = expression.replace('validator.', '');
            }

            return propertySource[propertyName] ? propertySource[propertyName] : null;
        });
    }
}
