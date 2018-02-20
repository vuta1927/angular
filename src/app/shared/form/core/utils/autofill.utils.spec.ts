import { AutoFillUtils } from './autofill.utils';

describe('DynamicFormAutoFillService test suite', () => {

    it('should validate autofill expressions correctly', () => {

        const value1 = 'section-test shipping mobile tel';
        const value2 = 'billing section-test mobile tel';
        const value3 = 'section-test shipping tel';
        const value4 = 'section-test work given-name';
        const value5 = 'billing cc-name';
        const value6 = 'home email';
        const value7 = 'section-test shipping work';
        const value8 = 'section-test work shipping tel';
        const value9 = 'billing country';
        const value10 = 'billing country name';
        const value11 = 'billing shipping name';
        const value12 = 'section-test1 section-test2 shipping name';
        const value13 = 'section-test1 blabla name';
        const value14 = 'section-test1 blabla mobile tel';

        expect(AutoFillUtils.validate(value1)).toBe(true);
        expect(AutoFillUtils.validate(value2)).toBe(false);
        expect(AutoFillUtils.validate(value3)).toBe(false);
        expect(AutoFillUtils.validate(value4)).toBe(false);
        expect(AutoFillUtils.validate(value5)).toBe(true);
        expect(AutoFillUtils.validate(value6)).toBe(true);
        expect(AutoFillUtils.validate(value7)).toBe(false);
        expect(AutoFillUtils.validate(value8)).toBe(false);
        expect(AutoFillUtils.validate(value9)).toBe(true);
        expect(AutoFillUtils.validate(value10)).toBe(false);
        expect(AutoFillUtils.validate(value11)).toBe(false);
        expect(AutoFillUtils.validate(value12)).toBe(false);
        expect(AutoFillUtils.validate(value13)).toBe(false);
        expect(AutoFillUtils.validate(value14)).toBe(false);
    });

    it('should validate address tokens correctly', () => {

        expect(AutoFillUtils.isAddressToken('shipping')).toBe(true);
        expect(AutoFillUtils.isAddressToken('billing')).toBe(true);
        expect(AutoFillUtils.isAddressToken('home')).toBe(false);
    });

    it('should validate contact tokens correctly', () => {

        expect(AutoFillUtils.isContactToken('home')).toBe(true);
        expect(AutoFillUtils.isContactToken('work')).toBe(true);
        expect(AutoFillUtils.isContactToken('mobile')).toBe(true);
        expect(AutoFillUtils.isContactToken('fax')).toBe(true);
        expect(AutoFillUtils.isContactToken('pager')).toBe(true);
        expect(AutoFillUtils.isContactToken('billing')).toBe(false);
    });

    it('should validate section tokens correctly', () => {

        expect(AutoFillUtils.isSectionToken('section-test')).toBe(true);
        expect(AutoFillUtils.isSectionToken('section')).toBe(false);
    });

    it('should validate contact fields correctly', () => {

        expect(AutoFillUtils.isContactField('tel')).toBe(true);
        expect(AutoFillUtils.isContactField('email')).toBe(true);
        expect(AutoFillUtils.isContactField('impp')).toBe(true);
        expect(AutoFillUtils.isContactField('name')).toBe(false);
        expect(AutoFillUtils.isContactField('country')).toBe(false);
    });

    it('should validate fields correctly', () => {

        expect(AutoFillUtils.isField('street-address')).toBe(true);
        expect(AutoFillUtils.isField('nickname')).toBe(true);
        expect(AutoFillUtils.isField('organization')).toBe(true);
        expect(AutoFillUtils.isField('postal-code')).toBe(true);
        expect(AutoFillUtils.isField('country')).toBe(true);
        expect(AutoFillUtils.isField('tel')).toBe(false);
        expect(AutoFillUtils.isField('email')).toBe(false);
    });
});
