import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStationsPage } from './view-stations.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStationsPageRoutingModule {}
