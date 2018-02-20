import { DynamicSwitchModel } from './dynamic-switch.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

describe('DynamicSwitchModel test suite', () => {

    let model: DynamicSwitchModel;
    const config = {
            id: 'switch'
        };

    beforeEach(() => model = new DynamicSwitchModel(config));

    it('should initialize correctly', () => {

        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.labelPosition).toBeNull();
        expect(model.offLabel).toBeNull();
        expect(model.onLabel).toBeNull();
        expect(model.type).toEqual(DynamicFormControlModelType.SWITCH);
        expect(model.value).toBe(false);
    });

    it('should serialize correctly', () => {

        const json = JSON.parse(JSON.stringify(model));

        expect(json.id).toEqual(model.id);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(DynamicFormControlModelType.SWITCH);
    });
});
