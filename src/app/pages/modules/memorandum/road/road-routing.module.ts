import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoadPage } from './road.page';

const routes: Routes = [
  {
    path: '',
    component: RoadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoadPageRoutingModule {}
