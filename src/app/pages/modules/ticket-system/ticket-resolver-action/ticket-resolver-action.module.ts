import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketResolverActionPageRoutingModule } from './ticket-resolver-action-routing.module';

import { TicketResolverActionPage } from './ticket-resolver-action.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TicketResolverActionPageRoutingModule,
  ],
  declarations: [TicketResolverActionPage],
})
export class TicketResolverActionPageModule {}
