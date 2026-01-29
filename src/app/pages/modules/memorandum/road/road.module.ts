import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoadPageRoutingModule } from './road-routing.module';

import { RoadPage } from './road.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoadPageRoutingModule
  ],
  declarations: [RoadPage]
})
export class RoadPageModule {}
