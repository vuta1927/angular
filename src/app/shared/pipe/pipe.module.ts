import { NgModule } from '@angular/core';
import { DateFormatPipe } from './date-format.pipe';
import { DateTimeFormatPipe } from './date-time-format.pipe';

@NgModule({
  declarations: [
    DateFormatPipe,
    DateTimeFormatPipe
  ],
  exports: [
    DateFormatPipe,
    DateTimeFormatPipe
  ]
})
export class PipeModule {}
