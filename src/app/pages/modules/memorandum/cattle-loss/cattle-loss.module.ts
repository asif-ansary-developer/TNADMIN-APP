import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CattleLossPageRoutingModule } from './cattle-loss-routing.module';

import { CattleLossPage } from './cattle-loss.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CattleLossPageRoutingModule
  ],
  declarations: [CattleLossPage]
})
export class CattleLossPageModule {}
