import { DynamicFormGroupModel } from './dynamic-form-group.model';
import { DynamicInputModel } from '../input/dynamic-input.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

describe('DynamicFormGroupModel test suite', () => {

    let model: DynamicFormGroupModel;
    const config: any = {
        id: 'formGroup',
        group: [
            new DynamicInputModel({
                id: 'input'
            })
        ],
        validators: {
            required: null
        }
    };

    beforeEach(() => model = new DynamicFormGroupModel(config));

    it('should initialize correctly', () => {

        expect(model.id).toEqual(config.id);
        expect(model.group.length === 1).toBe(true);
        expect(model.size() === model.group.length).toBe(true);
        expect(model.legend).toBeNull();
        expect(model.type).toEqual(DynamicFormControlModelType.GROUP);
    });

    it('should get the correct DynamicFormControlModel of group', () => {

        expect(model.get(0) === model.group[0]).toBe(true);
    });

    it('should correctly set a DynamicFormControlModel', () => {

        const newModel = new DynamicInputModel({ id: 'newInput' });

        model.set(0, newModel);

        expect(model.get(0) === newModel).toBe(true);
    });

    it('should correctly add a DynamicFormControlModel', () => {

        const newModel = new DynamicInputModel({ id: 'newInput' });

        model.add(newModel);

        expect(model.get(model.size() - 1) === newModel).toBe(true);
    });

    it('should serialize correctly', () => {

        const json = JSON.parse(JSON.stringify(model));

        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(DynamicFormControlModelType.GROUP);
        expect(Object.keys(json.validators)[0]).toEqual('required');
    });
});
