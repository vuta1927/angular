import { DynamicRatingModel } from './dynamic-rating.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

describe('DynamicRatingModel test suite', () => {

    let model: DynamicRatingModel;
    const config = {
        id: 'rating',
        max: 5,
        value: 2
    };

    beforeEach(() => model = new DynamicRatingModel(config));

    it('should initialize correctly', () => {

        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.max).toBe(config.max);
        expect(model.type).toEqual(DynamicFormControlModelType.RATING);
        expect(model.value).toBe(config.value);
    });

    it('should serialize correctly', () => {

        const json = JSON.parse(JSON.stringify(model));

        expect(json.id).toEqual(model.id);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(DynamicFormControlModelType.RATING);
    });
});
