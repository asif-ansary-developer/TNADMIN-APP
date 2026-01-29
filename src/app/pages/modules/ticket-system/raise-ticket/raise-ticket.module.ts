import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaiseTicketPageRoutingModule } from './raise-ticket-routing.module';

import { RaiseTicketPage } from './raise-ticket.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RaiseTicketPageRoutingModule,
  ],
  declarations: [RaiseTicketPage],
})
export class RaiseTicketPageModule {}
