import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewActionsHqPage } from './view-actions-hq.page';

const routes: Routes = [
  {
    path: '',
    component: ViewActionsHqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewActionsHqPageRoutingModule {}
