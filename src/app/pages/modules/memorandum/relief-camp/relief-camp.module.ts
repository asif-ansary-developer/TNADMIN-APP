import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReliefCampPageRoutingModule } from './relief-camp-routing.module';

import { ReliefCampPage } from './relief-camp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReliefCampPageRoutingModule
  ],
  declarations: [ReliefCampPage]
})
export class ReliefCampPageModule {}
