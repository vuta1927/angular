import { DynamicFormControlClsConfig } from '../dynamic-form-control.model';
import {
    DynamicFileControlModelConfig,
    DynamicFileControlModel
} from '../dynamic-file-control.model';
import { serializable } from '../../decorator/serializable.decorator';
import { DynamicFormControlModelType } from '../dynamic-form-control.model';

export interface DynamicFileUploadModelConfig extends DynamicFileControlModelConfig {

    accept?: string[];
    autoUpload?: boolean;
    maxSize?: number;
    minSize?: number;
    removeUrl?: string;
    showFileList?: boolean;
    url?: string;
}

export class DynamicFileUploadModel extends DynamicFileControlModel {

    @serializable() public accept: string[] | null;
    @serializable() public autoUpload: boolean;
    @serializable() public maxSize: number | null;
    @serializable() public minSize: number | null;
    @serializable() public removeUrl: string | null;
    @serializable() public showFileList: boolean;
    @serializable() public url: string | null;

    @serializable() public readonly type: string = DynamicFormControlModelType.FILE_UPLOAD;

    constructor(config: DynamicFileUploadModelConfig, clsConfig?: DynamicFormControlClsConfig) {

        super(config, clsConfig);

        this.accept = Array.isArray(config.accept) ? config.accept : null;
        this.autoUpload = typeof config.autoUpload === 'boolean' ? config.autoUpload : true;
        this.maxSize = typeof config.maxSize === 'number' ? config.maxSize : null;
        this.minSize = typeof config.minSize === 'number' ? config.minSize : null;
        this.removeUrl = config.removeUrl || null;
        this.showFileList = typeof config.showFileList === 'boolean' ? config.showFileList : true;
        this.url = config.url || null;
    }
}
