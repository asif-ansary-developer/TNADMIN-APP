import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FenceUpdatePageRoutingModule } from './fence-update-routing.module';

import { FenceUpdatePage } from './fence-update.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    FenceUpdatePageRoutingModule,
  ],
  declarations: [FenceUpdatePage],
})
export class FenceUpdatePageModule {}
