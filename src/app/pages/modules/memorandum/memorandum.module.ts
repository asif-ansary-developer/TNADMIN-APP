import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemorandumPageRoutingModule } from './memorandum-routing.module';

import { MemorandumPage } from './memorandum.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemorandumPageRoutingModule
  ],
  declarations: [MemorandumPage]
})
export class MemorandumPageModule {}
