import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResolutionAlertPage } from './resolution-alert.page';

const routes: Routes = [
  {
    path: '',
    component: ResolutionAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionAlertPageRoutingModule {}
