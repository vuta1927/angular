import { Directive, Input, TemplateRef } from '@angular/core';

export const DYNAMIC_TEMPLATE_DIRECTIVE_ALIGN_START = 'START';
export const DYNAMIC_TEMPLATE_DIRECTIVE_ALIGN_END = 'END';

@Directive({
    selector: 'ng-template[modelId],ng-template[modelType]'
})
export class DynamicTemplateDirective {

    @Input() public align: string = DYNAMIC_TEMPLATE_DIRECTIVE_ALIGN_END;
    @Input() public as: string | null = null;
    @Input() public modelId: string;
    @Input() public modelType: string;

    constructor(public templateRef: TemplateRef<any>) {}
}
