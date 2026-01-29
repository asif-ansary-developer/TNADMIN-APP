import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CulvertsPageRoutingModule } from './culverts-routing.module';

import { CulvertsPage } from './culverts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CulvertsPageRoutingModule
  ],
  declarations: [CulvertsPage]
})
export class CulvertsPageModule {}
