import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorticulturePage } from './horticulture.page';

const routes: Routes = [
  {
    path: '',
    component: HorticulturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorticulturePageRoutingModule {}
