import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTicketsVenMasterPage } from './view-tickets-ven-master.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTicketsVenMasterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTicketsVenMasterPageRoutingModule {}
