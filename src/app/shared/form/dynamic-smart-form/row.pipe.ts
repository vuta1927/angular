import { Pipe, PipeTransform } from '@angular/core';
import { DynamicFormControlModel } from 'app/shared/form/core';

import * as _ from 'lodash';

@Pipe({
    // tslint:disable-next-line:pipe-naming
    name: 'rowFilter'
})
export class RowPipe implements PipeTransform {
    public name: string;
    public pure?: boolean;
    public transform(values: any[], filter: string): any[] {
        const dynamicFormControlArray = values as DynamicFormControlModel[];
        if (!dynamicFormControlArray || !dynamicFormControlArray.length) { return []; }
        if (!filter) { return values; }

        return _.filter(dynamicFormControlArray, ['row', filter]);
    }
}
