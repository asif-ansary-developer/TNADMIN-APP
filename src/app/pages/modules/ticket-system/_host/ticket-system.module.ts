import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketSystemPageRoutingModule } from './ticket-system-routing.module';

import { TicketSystemPage } from './ticket-system.page';
import { TranslateModule } from '@ngx-translate/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TicketSystemPageRoutingModule,
  ],
  providers: [LocationAccuracy],
  declarations: [TicketSystemPage],
})
export class TicketSystemPageModule {}
