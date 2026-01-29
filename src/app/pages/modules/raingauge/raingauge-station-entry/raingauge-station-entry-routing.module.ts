import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaingaugeStationEntryPage } from './raingauge-station-entry.page';

const routes: Routes = [
  {
    path: '',
    component: RaingaugeStationEntryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaingaugeStationEntryPageRoutingModule {}
