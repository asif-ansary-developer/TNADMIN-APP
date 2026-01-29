import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorticulturePageRoutingModule } from './horticulture-routing.module';

import { HorticulturePage } from './horticulture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorticulturePageRoutingModule
  ],
  declarations: [HorticulturePage]
})
export class HorticulturePageModule {}
