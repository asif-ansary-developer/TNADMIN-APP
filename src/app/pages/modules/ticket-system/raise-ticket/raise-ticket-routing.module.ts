import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaiseTicketPage } from './raise-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: RaiseTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaiseTicketPageRoutingModule {}
