import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StationListPage } from './station-list.page';

const routes: Routes = [
  {
    path: '',
    component: StationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StationListPageRoutingModule {}
