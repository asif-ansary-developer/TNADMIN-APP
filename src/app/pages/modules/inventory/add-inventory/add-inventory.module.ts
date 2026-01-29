import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInventoryPageRoutingModule } from './add-inventory-routing.module';

import { AddInventoryPage } from './add-inventory.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AddInventoryPageRoutingModule,
  ],
  declarations: [AddInventoryPage],
})
export class AddInventoryPageModule {}
