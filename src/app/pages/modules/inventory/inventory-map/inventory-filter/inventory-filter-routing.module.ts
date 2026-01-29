import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryFilterPage } from './inventory-filter.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryFilterPageRoutingModule {}
