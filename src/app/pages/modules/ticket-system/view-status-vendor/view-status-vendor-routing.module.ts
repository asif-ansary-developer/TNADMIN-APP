import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewStatusVendorPage } from './view-status-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: ViewStatusVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewStatusVendorPageRoutingModule {}
