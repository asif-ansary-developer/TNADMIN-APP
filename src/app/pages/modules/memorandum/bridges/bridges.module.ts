import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BridgesPageRoutingModule } from './bridges-routing.module';

import { BridgesPage } from './bridges.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BridgesPageRoutingModule
  ],
  declarations: [BridgesPage]
})
export class BridgesPageModule {}
