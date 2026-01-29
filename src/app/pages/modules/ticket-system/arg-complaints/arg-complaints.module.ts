import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArgComplaintsPageRoutingModule } from './arg-complaints-routing.module';

import { ArgComplaintsPage } from './arg-complaints.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArgComplaintsPageRoutingModule
  ],
  declarations: [ArgComplaintsPage]
})
export class ArgComplaintsPageModule {}
