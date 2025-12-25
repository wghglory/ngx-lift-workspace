import {NgModule} from '@angular/core';

import {TooltipComponent} from './tooltip.component';
import {TooltipDirective} from './tooltip.directive';

@NgModule({
  imports: [TooltipComponent, TooltipDirective],
  exports: [TooltipComponent, TooltipDirective],
})
export class TooltipModule {}
