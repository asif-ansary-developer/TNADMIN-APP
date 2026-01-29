import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';

import { AddInventorySlidePageRoutingModule } from './add-inventory-slide-routing.module';

import { AddInventorySlidePage } from './add-inventory-slide.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SwiperModule,
    ReactiveFormsModule,
    AddInventorySlidePageRoutingModule,
  ],
  declarations: [AddInventorySlidePage],
})
export class AddInventorySlidePageModule {}
