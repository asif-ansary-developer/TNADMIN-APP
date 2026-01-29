import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewClosuresPageRoutingModule } from './view-closures-routing.module';

import { ViewClosuresPage } from './view-closures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewClosuresPageRoutingModule
  ],
  declarations: [ViewClosuresPage]
})
export class ViewClosuresPageModule {}
