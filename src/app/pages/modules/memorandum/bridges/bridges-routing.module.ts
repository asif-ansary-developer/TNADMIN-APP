import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BridgesPage } from './bridges.page';

const routes: Routes = [
  {
    path: '',
    component: BridgesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BridgesPageRoutingModule {}
