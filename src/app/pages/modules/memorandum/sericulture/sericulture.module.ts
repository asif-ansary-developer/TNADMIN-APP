import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SericulturePageRoutingModule } from './sericulture-routing.module';

import { SericulturePage } from './sericulture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SericulturePageRoutingModule
  ],
  declarations: [SericulturePage]
})
export class SericulturePageModule {}
