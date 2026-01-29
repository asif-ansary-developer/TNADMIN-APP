import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistrictSelectorPage } from './district-selector.page';

const routes: Routes = [
  {
    path: '',
    component: DistrictSelectorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DistrictSelectorPageRoutingModule {}
