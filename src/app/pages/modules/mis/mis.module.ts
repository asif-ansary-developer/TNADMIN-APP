import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisPageRoutingModule } from './mis-routing.module';

import { MisPage } from './mis.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MisPageRoutingModule,
  ],
  declarations: [MisPage],
})
export class MisPageModule {}
