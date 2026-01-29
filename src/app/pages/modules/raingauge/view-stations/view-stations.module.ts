import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStationsPageRoutingModule } from './view-stations-routing.module';

import { ViewStationsPage } from './view-stations.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewStationsPageRoutingModule,
  ],
  declarations: [ViewStationsPage],
})
export class ViewStationsPageModule {}
