import { DynamicDatePickerModel } from './dynamic-datepicker.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

describe('DynamicDatepickerModel test suite', () => {

    let model: DynamicDatePickerModel;
    const config = {
        id: 'datepicker',
        value: new Date()
    };

    beforeEach(() => model = new DynamicDatePickerModel(config));

    it('should initialize correctly', () => {

        expect(model.disabled).toBe(false);
        expect(model.focusedDate).toBeNull();
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.format).toBeNull();
        expect(model.max).toBeNull();
        expect(model.min).toBeNull();
        expect(model.type).toEqual(DynamicFormControlModelType.DATEPICKER);
        expect(model.value).toBe(config.value);
    });

    it('should serialize correctly', () => {

        const json = JSON.parse(JSON.stringify(model));

        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(DynamicFormControlModelType.DATEPICKER);
        expect(json.value).toBe((model.value as Date).toJSON());
    });
});
