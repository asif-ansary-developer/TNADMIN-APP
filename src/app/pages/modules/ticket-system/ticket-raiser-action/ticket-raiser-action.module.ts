import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketRaiserActionPageRoutingModule } from './ticket-raiser-action-routing.module';

import { TicketRaiserActionPage } from './ticket-raiser-action.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TicketRaiserActionPageRoutingModule,
  ],
  declarations: [TicketRaiserActionPage],
})
export class TicketRaiserActionPageModule {}
