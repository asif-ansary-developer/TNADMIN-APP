import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OverallStatusmapPage } from './overall-statusmap.page';

const routes: Routes = [
  {
    path: '',
    component: OverallStatusmapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverallStatusmapPageRoutingModule {}
