import { TestBed, inject } from '@angular/core/testing';
import {
    ReactiveFormsModule, FormControl, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { DynamicFormValidationService } from './dynamic-form-validation.service';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicInputModel } from '../model/input/dynamic-input.model';

describe('DynamicFormValidationService test suite', () => {

    let service: DynamicFormValidationService;

    function testValidator() {
        return { testValidator: { valid: true } };
    }

    function testAsyncValidator() {
        return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 0));
    }

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [
                DynamicFormValidationService,
                { provide: NG_VALIDATORS, useValue: testValidator, multi: true },
                { provide: NG_ASYNC_VALIDATORS, useValue: testAsyncValidator, multi: true }
            ]
        });
    });

    beforeEach(inject([DynamicFormValidationService],
        (validationService: DynamicFormValidationService) => service = validationService));

    it('should resolve a validator by name', () => {

        expect(service.getValidator('required')).toBeTruthy();
        expect(service.getValidator('testValidator')).toBeTruthy();
    });

    it('should resolve a async validator by name correctly', () => {

        expect(service.getAsyncValidator('testAsyncValidator')).toBeTruthy();
    });

    it('should resolve validators from config', () => {

        const config: any = { required: null, maxLength: 7, minLength: 3 };
        const validators = service.getValidators(config);

        expect(validators.length === Object.keys(config).length).toBe(true);
    });

    it('should resolve custom validators from config', () => {

        const config: any = { required: null, maxLength: 7, testValidator: null };
        const validators = service.getValidators(config);

        expect(validators.length === Object.keys(config).length).toBe(true);
    });

    it('should resolve custom validators from detailed config', () => {

        const config: any = { testValidator: { name: testValidator.name, args: null } };
        const validators = service.getValidators(config);

        expect(validators.length === Object.keys(config).length).toBe(true);
    });

    it('should resolve custom async validators from config', () => {

        const config: any = { testAsyncValidator: null };
        const validators = service.getAsyncValidators(config);

        expect(validators.length === Object.keys(config).length).toBe(true);
    });

    it('should throw when validator is not provided via NG_VALIDATORS', () => {

        expect(() => service.getValidator('test', null))
            // tslint:disable-next-line:max-line-length
            .toThrow(new Error(`validator "test" is not provided via NG_VALIDATORS or NG_ASYNC_VALIDATORS`));
    });

    it('should update validators on control and model', () => {

        const config: any = { testValidator: null };
        const control: FormControl = new FormControl();
        const model: DynamicFormControlModel = new DynamicInputModel({ id: 'input' });

        expect(control['validator']).toBeNull();
        expect(model.validators).toBeNull();

        service.updateValidators(config, control, model);

        expect(typeof control['validator'] === 'function').toBe(true);
        expect((model.validators as object).hasOwnProperty('testValidator')).toBe(true);

        service.updateValidators(null, control, model);

        expect(control['validator']).toBeNull();
        expect(model.validators).toBeNull();
    });

    it('should update async validators on control and model', () => {

        const config: any = { testAsyncValidator: null };
        const control: FormControl = new FormControl();
        const model: DynamicFormControlModel = new DynamicInputModel({ id: 'input' });

        expect(control['asyncValidator']).toBeNull();
        expect(model.asyncValidators).toBeNull();

        service.updateAsyncValidators(config, control, model);

        expect(typeof control['asyncValidator'] === 'function').toBe(true);
        expect((model.asyncValidators as object).hasOwnProperty('testAsyncValidator')).toBe(true);

        service.updateAsyncValidators(null, control, model);

        expect(control['asyncValidator']).toBeNull();
        expect(model.asyncValidators).toBeNull();
    });

    it('should create error messages', () => {

        let errorMessages;
        const testControl: FormControl = new FormControl();
        const testModel: DynamicFormControlModel = new DynamicInputModel({
            id: 'testModel',
            errorMessages: {
                required: 'Field is required',
                minLength: 5,
                custom1: 'Field {{ id }} has a custom error',
                custom2: 'Field has a custom error: {{ validator.param }}'
            }
        });

        errorMessages = service.createErrorMessages(testControl, testModel);
        expect(errorMessages.length).toBe(0);

        testControl.setErrors({ required: true, minlength: 5 });

        errorMessages = service.createErrorMessages(testControl, testModel);
        expect(errorMessages.length).toBe(1);
        expect(errorMessages[0]).toEqual((testModel.errorMessages as any)['required']);

        testControl.setErrors({ custom1: true });

        errorMessages = service.createErrorMessages(testControl, testModel);
        expect(errorMessages.length).toBe(1);
        expect(errorMessages[0]).toEqual(`Field ${testModel.id} has a custom error`);

        testControl.setErrors({ custom2: { param: 42 } });

        errorMessages = service.createErrorMessages(testControl, testModel);
        expect(errorMessages.length).toBe(1);
        expect(errorMessages[0]).toEqual('Field has a custom error: 42');
    });

    it('should check form hooks', () => {

        expect(service.isFormHook(null)).toBe(false);
        expect(service.isFormHook('blur')).toBe(true);
        expect(service.isFormHook('focus')).toBe(false);
        expect(service.isFormHook('change')).toBe(true);
        expect(service.isFormHook('submit')).toBe(true);
    });
});
