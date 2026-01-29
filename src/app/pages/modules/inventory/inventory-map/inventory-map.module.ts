import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryMapPageRoutingModule } from './inventory-map-routing.module';

import { InventoryMapPage } from './inventory-map.page';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryMapPageRoutingModule,
  ],
  providers: [LocationAccuracy],
  declarations: [InventoryMapPage],
})
export class InventoryMapPageModule {}
