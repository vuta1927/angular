import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { AbstractControlOptions, FormHooks } from '@angular/forms/src/model';
import {
    DynamicFormControlModel,
    DynamicPathable,
    DynamicValidatorsConfig
} from '../model/dynamic-form-control.model';
import {
    DynamicFormValueControlModel,
    DynamicFormControlValue
} from '../model/dynamic-form-value-control.model';
import {
    DynamicFormArrayModel,
    DynamicFormArrayGroupModel
} from '../model/form-array/dynamic-form-array.model';
import { DynamicFormGroupModel } from '../model/form-group/dynamic-form-group.model';
import { DynamicCheckboxGroupModel } from '../model/checkbox/dynamic-checkbox-group.model';
import { DynamicCheckboxModel } from '../model/checkbox/dynamic-checkbox.model';
import { DynamicDatePickerModel } from '../model/datepicker/dynamic-datepicker.model';
import { DynamicEditorModel } from '../model/editor/dynamic-editor.model';
import { DynamicFileUploadModel } from '../model/file-upload/dynamic-file-upload.model';
import { DynamicInputModel } from '../model/input/dynamic-input.model';
import { DynamicRadioGroupModel } from '../model/radio/dynamic-radio-group.model';
import { DynamicRatingModel } from '../model/rating/dynamic-rating.model';
import { DynamicSelectModel } from '../model/select/dynamic-select.model';
import { DynamicSliderModel } from '../model/slider/dynamic-slider.model';
import { DynamicSwitchModel } from '../model/switch/dynamic-switch.model';
import { DynamicTextAreaModel } from '../model/textarea/dynamic-textarea.model';
import { DynamicTimePickerModel } from '../model/timepicker/dynamic-timepicker.model';
import { Utils } from '../utils/core.utils';
import { DynamicFormValidationService } from './dynamic-form-validation.service';
import { DynamicFormControlModelType } from '../model/dynamic-form-control.model';

@Injectable()
export class DynamicFormService {

    constructor(private validationService: DynamicFormValidationService) { }

    public createFormArray(model: DynamicFormArrayModel): FormArray {

        const controls: AbstractControl[] = [];
        const options = this.createAbstractControlOptions(
            model.validators, model.asyncValidators, model.updateOn);

        for (let index = 0; index < model.size; index++) {

            const groupModel = model.get(index);
            const groupOptions = this.createAbstractControlOptions(
                model.groupValidators, model.groupAsyncValidators, model.updateOn);

            controls.push(this.createFormGroup(groupModel.group, groupOptions, groupModel));
        }

        return new FormArray(controls, options);
    }

    public createFormGroup(
        models: DynamicFormControlModel[],
        options: AbstractControlOptions | null = null,
        parent: DynamicPathable | null = null): FormGroup {

        const controls: { [controlId: string]: AbstractControl; } = {};

        models.forEach((model) => {

            model.parent = parent;

            switch (model.type) {

                case DynamicFormControlModelType.ARRAY:

                    controls[model.id] = this.createFormArray(model as DynamicFormArrayModel);
                    break;

                case DynamicFormControlModelType.GROUP:
                case DynamicFormControlModelType.CHECKBOX_GROUP:
                case DynamicFormControlModelType.ROW:

                    const groupModel = model as DynamicFormGroupModel;
                    const groupOptions = this.createAbstractControlOptions(
                        groupModel.validators, groupModel.asyncValidators, groupModel.updateOn);

                    controls[model.id] =
                        this.createFormGroup(groupModel.group, groupOptions, groupModel);
                    break;

                default:

                    const controlModel =
                        model as DynamicFormValueControlModel<DynamicFormControlValue>;
                    const controlState = {
                        value: controlModel.value,
                        disabled: controlModel.disabled
                    };
                    const controlOptions = this.createAbstractControlOptions(
                        controlModel.validators,
                        controlModel.asyncValidators,
                        controlModel.updateOn);

                    controls[model.id] = new FormControl(controlState, controlOptions);
            }
        });

        return new FormGroup(controls, options);
    }

    public getPathSegment(model: DynamicPathable): string {

        return model instanceof DynamicFormArrayGroupModel ?
            model.index.toString() : (model as DynamicFormControlModel).id;
    }

    public getPath(model: DynamicPathable): string[] {

        const path = [this.getPathSegment(model)];
        let parent = model.parent;

        while (parent) {

            path.unshift(this.getPathSegment(parent));
            parent = parent.parent;
        }

        return path;
    }

    public addFormGroupControl(
        formGroup: FormGroup,
        model: DynamicFormControlModel[] | DynamicFormGroupModel,
        ...controlModels: DynamicFormControlModel[]): void {

        if (model instanceof DynamicFormGroupModel) {

            this.insertFormGroupControl(model.size(), formGroup, model, ...controlModels);

        } else {

            const formModel = model as DynamicFormControlModel[];
            this.insertFormGroupControl(formModel.length, formGroup, formModel, ...controlModels);
        }
    }

    public moveFormGroupControl(
        index: number,
        step: number,
        model: DynamicFormControlModel[] | DynamicFormGroupModel): void {

        if (model instanceof DynamicFormGroupModel) {

            model.move(index, step);

        } else {

            const formModel = model as DynamicFormControlModel[];
            formModel.splice(index + step, 0, ...formModel.splice(index, 1));
        }
    }

    public insertFormGroupControl(
        index: number,
        formGroup: FormGroup,
        model: DynamicFormControlModel[] | DynamicFormGroupModel,
        ...controlModels: DynamicFormControlModel[]): void {

        const parent = model instanceof DynamicFormGroupModel ? model : null;
        const controls = this.createFormGroup(controlModels, null, parent).controls;

        Object.keys(controls).forEach((controlName, idx) => {

            const controlModel = controlModels[idx];

            if (model instanceof DynamicFormGroupModel) {
                model.insert(index, controlModel);

            } else {
                (model as DynamicFormControlModel[]).splice(index, 0, controlModel);
            }

            formGroup.addControl(controlName, controls[controlName]);
        });
    }

    public removeFormGroupControl(index: number,
                                  formGroup: FormGroup,
                                  model: DynamicFormControlModel[] | DynamicFormGroupModel): void {

        if (model instanceof DynamicFormGroupModel) {
            formGroup.removeControl(model.get(index).id);
            model.remove(index);
        } else {
            formGroup.removeControl(model[index].id);
            (model as DynamicFormControlModel[]).splice(index, 1);
        }
    }

    public addFormArrayGroup(formArray: FormArray, model: DynamicFormArrayModel): void {

        const groupModel = model.addGroup();

        formArray.push(this.createFormGroup(groupModel.group, null, groupModel));
    }

    public insertFormArrayGroup(
        index: number,
        formArray: FormArray,
        model: DynamicFormArrayModel): void {

        const groupModel = model.insertGroup(index);
        formArray.insert(index, this.createFormGroup(groupModel.group, null, groupModel));
    }

    public moveFormArrayGroup(
        index: number,
        step: number,
        formArray: FormArray,
        model: DynamicFormArrayModel): void {

        const newIndex = index + step;
        const moveUp = step >= 0;

        if ((index >= 0 && index < model.size) && (newIndex >= 0 && newIndex < model.size)) {

            const movingGroups: AbstractControl[] = [];

            for (let i = moveUp ? index : newIndex; i <= (moveUp ? newIndex : index); i++) {
                movingGroups.push(formArray.at(i));
            }

            movingGroups.forEach((formControl, idx) => {

                let position;

                if (moveUp) {
                    position = idx === 0 ? newIndex : index + idx - 1;

                } else {
                    position = idx === movingGroups.length - 1 ? newIndex : newIndex + idx + 1;
                }

                formArray.setControl(position, formControl);
            });

            model.moveGroup(index, step);

        } else {
            // tslint:disable-next-line:max-line-length
            throw new Error(`form array group cannot be moved due to index or new index being out of bounds`);
        }
    }

    public removeFormArrayGroup(index: number,
                                formArray: FormArray,
                                model: DynamicFormArrayModel): void {

        formArray.removeAt(index);
        model.removeGroup(index);
    }

    public clearFormArray(formArray: FormArray, model: DynamicFormArrayModel): void {

        while (formArray.length > 0) {
            this.removeFormArrayGroup(0, formArray, model);
        }
    }

    public findById(id: string, model: DynamicFormControlModel[]): DynamicFormControlModel | null {

        let result = null;
        // tslint:disable-next-line:no-shadowed-variable
        const findByIdFn = (id: string, groupModel: DynamicFormControlModel[]): void => {

            for (const controlModel of groupModel) {

                if (controlModel.id === id) {
                    result = controlModel;
                    break;
                }

                if (controlModel instanceof DynamicFormGroupModel) {
                    findByIdFn(id, (controlModel as DynamicFormGroupModel).group);
                }
            }
        };

        findByIdFn(id, model);

        return result;
    }

    public fromJSON(json: string | object[]): DynamicFormControlModel[] | never {

        const rawFormModel = typeof json === 'string'
        ? JSON.parse(json, Utils.parseJSONReviver)
        : json;
        const formModel: DynamicFormControlModel[] = [];

        rawFormModel.forEach((model: any) => {

            switch (model.type) {

                case DynamicFormControlModelType.ARRAY:
                    const formArrayModel = model as DynamicFormArrayModel;

                    if (Array.isArray(formArrayModel.groups)) {
                        formArrayModel.groups.forEach((groupModel: DynamicFormArrayGroupModel) => {
                            groupModel.group =
                                this.fromJSON(groupModel.group) as DynamicFormControlModel[];
                        });
                    }

                    formArrayModel.groupFactory = () => {
                        return this.fromJSON(formArrayModel.groupPrototype ||
                            formArrayModel.origin);
                    };

                    formModel.push(new DynamicFormArrayModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.CHECKBOX:
                    formModel.push(new DynamicCheckboxModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.CHECKBOX_GROUP:
                    model.group = this.fromJSON(model.group) as DynamicCheckboxModel[];
                    formModel.push(new DynamicCheckboxGroupModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.DATEPICKER:
                    formModel.push(new DynamicDatePickerModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.EDITOR:
                    formModel.push(new DynamicEditorModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.FILE_UPLOAD:
                    model.value = null;
                    formModel.push(new DynamicFileUploadModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.GROUP:
                    model.group = this.fromJSON(model.group);
                    formModel.push(new DynamicFormGroupModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.INPUT:
                    const inputModel = model as DynamicInputModel;

                    if (inputModel.mask !== null) {
                        inputModel.mask = Utils.maskFromString(inputModel.mask as string);
                    }

                    formModel.push(new DynamicInputModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.RADIO_GROUP:
                    formModel.push(new DynamicRadioGroupModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.RATING:
                    formModel.push(new DynamicRatingModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.SELECT:
                    formModel.push(new DynamicSelectModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.SLIDER:
                    formModel.push(new DynamicSliderModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.SWITCH:
                    formModel.push(new DynamicSwitchModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.TEXTAREA:
                    formModel.push(new DynamicTextAreaModel(model, model.cls));
                    break;

                case DynamicFormControlModelType.TIMEPICKER:
                    formModel.push(new DynamicTimePickerModel(model, model.cls));
                    break;

                default:
                    // tslint:disable-next-line:max-line-length
                    throw new Error(`unknown form control model type defined on JSON object with id "${model.id}"`);
            }
        });

        return formModel;
    }

    public validateAllFormFields(formGroup: FormGroup) {

        Object.keys(formGroup.controls).forEach((field) => {

            const control = formGroup.get(field);

            if (control instanceof FormControl) {

                control.markAsTouched({ onlySelf: true });

            } else if (control instanceof FormGroup) {

                this.validateAllFormFields(control);

            }
        });
    }

    private createAbstractControlOptions(
        validatorsConfig: DynamicValidatorsConfig | null = null,
        asyncValidatorsConfig: DynamicValidatorsConfig | null = null,
        updateOn: FormHooks | null = null): AbstractControlOptions {

        return {

            asyncValidators: asyncValidatorsConfig !== null
                ? this.validationService.getAsyncValidators(asyncValidatorsConfig)
                : null,

            validators: validatorsConfig !== null
            ? this.validationService.getValidators(validatorsConfig)
            : null,

            updateOn: updateOn !== null && this.validationService.isFormHook(updateOn)
            ? updateOn
            : 'change'
        };
    }
}
