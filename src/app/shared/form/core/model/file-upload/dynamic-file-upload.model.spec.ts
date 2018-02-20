import {
    DynamicFileUploadModel
} from './dynamic-file-upload.model';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

describe('DynamicFileUploadModel test suite', () => {

    let model: DynamicFileUploadModel;
    const config: any = {
        id: 'upload'
    };

    beforeEach(() => model = new DynamicFileUploadModel(config));

    it('should initialize correctly', () => {

        expect(model.autoUpload).toBe(true);
        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.multiple).toBe(false);
        expect(model.removeUrl).toBeNull();
        expect(model.showFileList).toBe(true);
        expect(model.type).toEqual(DynamicFormControlModelType.FILE_UPLOAD);
        expect(model.url).toBeNull();
        expect(model.value).toBeNull();
    });

    it('should serialize correctly', () => {

        const json = JSON.parse(JSON.stringify(model));

        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(DynamicFormControlModelType.FILE_UPLOAD);
        expect(json.value).toBeNull();
    });
});
