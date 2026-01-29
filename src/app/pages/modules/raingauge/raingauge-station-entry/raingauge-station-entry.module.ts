import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaingaugeStationEntryPageRoutingModule } from './raingauge-station-entry-routing.module';

import { RaingaugeStationEntryPage } from './raingauge-station-entry.page';
import { TranslateModule } from '@ngx-translate/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RaingaugeStationEntryPageRoutingModule,
  ],
  declarations: [RaingaugeStationEntryPage],
  providers: [LocationAccuracy],
})
export class RaingaugeStationEntryPageModule {}
