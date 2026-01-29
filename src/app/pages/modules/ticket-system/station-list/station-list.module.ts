import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StationListPageRoutingModule } from './station-list-routing.module';

import { StationListPage } from './station-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    StationListPageRoutingModule,
  ],
  declarations: [StationListPage],
})
export class StationListPageModule {}
