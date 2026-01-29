import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocPickerPageRoutingModule } from './loc-picker-routing.module';

import { LocPickerPage } from './loc-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocPickerPageRoutingModule
  ],
  declarations: [LocPickerPage]
})
export class LocPickerPageModule {}
