import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Constants } from '../../constants';

@Pipe({
  // tslint:disable-next-line:pipe-naming
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  public transform(value: any, args?: any): any {
    return super.transform(value, Constants.DATE_FMT);
  }
}
