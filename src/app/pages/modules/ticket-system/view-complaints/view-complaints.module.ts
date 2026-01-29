import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewComplaintsPageRoutingModule } from './view-complaints-routing.module';

import { ViewComplaintsPage } from './view-complaints.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewComplaintsPageRoutingModule
  ],
  declarations: [ViewComplaintsPage]
})
export class ViewComplaintsPageModule {}
