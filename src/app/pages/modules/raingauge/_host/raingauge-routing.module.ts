import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaingaugePage } from './raingauge.page';

const routes: Routes = [
  {
    path: '',
    component: RaingaugePage,
  },

  {
    path: 'view-stations',
    loadChildren: () =>
      import('../view-stations/view-stations.module').then(
        (m) => m.ViewStationsPageModule
      ),
  },
  {
    path: 'station-list',
    loadChildren: () =>
      import('../station-list/station-list.module').then(
        (m) => m.StationListPageModule
      ),
  },
  {
    path: 'raingauge-station-entry',
    loadChildren: () =>
      import('../raingauge-station-entry/raingauge-station-entry.module').then(
        (m) => m.RaingaugeStationEntryPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaingaugePageRoutingModule {}
