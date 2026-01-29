import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatusAdmin2PageRoutingModule } from './view-status-admin-2-routing.module';

import { ViewStatusAdmin2Page } from './view-status-admin-2.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewStatusAdmin2PageRoutingModule,
  ],
  declarations: [ViewStatusAdmin2Page],
})
export class ViewStatusAdmin2PageModule {}
