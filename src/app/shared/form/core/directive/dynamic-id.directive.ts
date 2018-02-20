import { Directive, ElementRef, Input, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
    selector: '[dynamicId]'
})
export class DynamicIdDirective implements AfterViewInit {

    @Input() public dynamicId: string | boolean;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

    public ngAfterViewInit() {

        if (this.dynamicId) {
            this.renderer.setAttribute(
                this.elementRef.nativeElement, 'id', this.dynamicId as string);
        }
    }
}
