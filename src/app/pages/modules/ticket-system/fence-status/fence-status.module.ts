import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FenceStatusPageRoutingModule } from './fence-status-routing.module';

import { FenceStatusPage } from './fence-status.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    FenceStatusPageRoutingModule,
  ],
  declarations: [FenceStatusPage],
})
export class FenceStatusPageModule {}
