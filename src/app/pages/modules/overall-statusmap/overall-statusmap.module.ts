import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverallStatusmapPageRoutingModule } from './overall-statusmap-routing.module';

import { OverallStatusmapPage } from './overall-statusmap.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    OverallStatusmapPageRoutingModule,
  ],
  declarations: [OverallStatusmapPage],
})
export class OverallStatusmapPageModule {}
