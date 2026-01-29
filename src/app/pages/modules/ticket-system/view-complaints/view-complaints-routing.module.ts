import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewComplaintsPage } from './view-complaints.page';

const routes: Routes = [
  {
    path: '',
    component: ViewComplaintsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewComplaintsPageRoutingModule {}
