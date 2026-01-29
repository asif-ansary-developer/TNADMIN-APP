import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewActionsHqPageRoutingModule } from './view-actions-hq-routing.module';

import { ViewActionsHqPage } from './view-actions-hq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewActionsHqPageRoutingModule
  ],
  declarations: [ViewActionsHqPage]
})
export class ViewActionsHqPageModule {}
