import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStatusAdmin2Page } from './view-status-admin-2.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStatusAdmin2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStatusAdmin2PageRoutingModule {}
