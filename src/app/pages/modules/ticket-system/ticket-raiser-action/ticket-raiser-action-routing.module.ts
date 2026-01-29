import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketRaiserActionPage } from './ticket-raiser-action.page';

const routes: Routes = [
  {
    path: '',
    component: TicketRaiserActionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketRaiserActionPageRoutingModule {}
