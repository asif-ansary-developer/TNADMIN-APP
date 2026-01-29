import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TsPageRoutingModule } from './ts-routing.module';

import { TsPage } from './ts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TsPageRoutingModule
  ],
  declarations: [TsPage]
})
export class TsPageModule {}
