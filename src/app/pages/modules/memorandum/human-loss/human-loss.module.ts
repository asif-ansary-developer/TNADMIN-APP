import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HumanLossPageRoutingModule } from './human-loss-routing.module';

import { HumanLossPage } from './human-loss.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HumanLossPageRoutingModule
  ],
  declarations: [HumanLossPage]
})
export class HumanLossPageModule {}
