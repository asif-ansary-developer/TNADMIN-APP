import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketViewerPageRoutingModule } from './ticket-viewer-routing.module';

import { TicketViewerPage } from './ticket-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketViewerPageRoutingModule
  ],
  declarations: [TicketViewerPage]
})
export class TicketViewerPageModule {}
