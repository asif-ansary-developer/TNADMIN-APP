import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HumanLossPage } from './human-loss.page';

const routes: Routes = [
  {
    path: '',
    component: HumanLossPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HumanLossPageRoutingModule {}
