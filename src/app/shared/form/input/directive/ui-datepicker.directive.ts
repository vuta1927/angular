import { OnInit, ElementRef, Input, Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Constants } from 'app/constants';

declare let $: any;

export const CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    // tslint:disable-next-line:no-forward-ref
    useExisting: forwardRef(() => UiDatepickerDirective),
    multi: true
};

@Directive({
    selector: '[uiDatepicker]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(blur)': 'onTouched($event)'
    },
    providers: [CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class UiDatepickerDirective implements OnInit {
    @Input('changeMonth') public changeMonth: boolean;
    @Input('changeYear') public changeYear: boolean;
    @Input('dateFormat') public dateFormat: string;
    @Input('minDate') public minDate: Date | string | number;
    @Input('maxDate') public maxDate: Date | string | number;
    @Input('numberOfMonths') public numberOfMonths: number;
    @Input('selectOtherMonths') public selectOtherMonths: boolean;
    @Input('showButtonPanel') public showButtonPanel: boolean;
    @Input('showOtherMonths') public showOtherMonths: boolean;
    @Input('showAnim') public showAnim:
        'show' | 'slideDown' |
        'fadeIn' | 'blind' | 'bounce' | 'clip' | 'drop' | 'fold' | 'slide' | '';
    @Input('showWeek') public showWeek: boolean;

    private innerValue: string;

    constructor(private el: ElementRef) { }

    public ngOnInit() {
        if (this.dateFormat === null) {
            this.dateFormat = Constants.DATE_FMT_JQUI;
        }

        const d = this.el.nativeElement;

        $(document).ready(function() {
            $(d).datepicker({
                changeMonth: this.changeMonth,
                changeYear: this.changeYear,
                dateFormat: this.dateFormat,
                nextText: '<i class="fa fa-chevron-right"></i>',
                prevText: '<i class="fa fa-chevron-left"></i>',
                numberOfMonths: this.numberOfMonths,
                maxDate: this.maxDate,
                minDate: this.minDate,
                selectOtherMonths: this.selectOtherMonths,
                showButtonPanel: this.showButtonPanel,
                showOtherMonths: this.showOtherMonths,
                showAnim: this.showAnim,
                showWeek: this.showWeek
            }).on('change', (e: any) => {
                // this.onChange(e.target.value);
            });
        });
    }

    public onChange: any = (_: any) => { /*Empty*/ };
    public onTouched: any = () => { /*Empty*/ };

    get value(): any {
        return this.innerValue;
    }

    // set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChange(v);
        }
    }

    public writeValue(val: string): void {
        this.innerValue = val;

        console.log();
        $(this.el.nativeElement).datepicker('setDate', this.innerValue);
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
