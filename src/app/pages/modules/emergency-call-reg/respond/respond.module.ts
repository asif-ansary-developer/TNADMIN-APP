import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RespondPageRoutingModule } from './respond-routing.module';

import { RespondPage } from './respond.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RespondPageRoutingModule,
  ],
  declarations: [RespondPage],
})
export class RespondPageModule {}
