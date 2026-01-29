import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryFilterPageRoutingModule } from './inventory-filter-routing.module';

import { InventoryFilterPage } from './inventory-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryFilterPageRoutingModule
  ],
  declarations: [InventoryFilterPage]
})
export class InventoryFilterPageModule {}
