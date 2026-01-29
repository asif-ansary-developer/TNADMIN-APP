import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketResolverActionPage } from './ticket-resolver-action.page';

const routes: Routes = [
  {
    path: '',
    component: TicketResolverActionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketResolverActionPageRoutingModule {}
