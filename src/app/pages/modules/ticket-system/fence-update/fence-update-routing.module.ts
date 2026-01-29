import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FenceUpdatePage } from './fence-update.page';

const routes: Routes = [
  {
    path: '',
    component: FenceUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FenceUpdatePageRoutingModule {}
