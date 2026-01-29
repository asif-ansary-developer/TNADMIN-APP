import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FenceStatusPage } from './fence-status.page';

const routes: Routes = [
  {
    path: '',
    component: FenceStatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FenceStatusPageRoutingModule {}
