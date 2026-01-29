import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStatusAdminPage } from './view-status-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStatusAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStatusAdminPageRoutingModule {}
