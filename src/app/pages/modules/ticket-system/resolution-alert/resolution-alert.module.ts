import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionAlertPageRoutingModule } from './resolution-alert-routing.module';

import { ResolutionAlertPage } from './resolution-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionAlertPageRoutingModule
  ],
  declarations: [ResolutionAlertPage]
})
export class ResolutionAlertPageModule {}
