import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddInventorySlidePage } from './add-inventory-slide.page';

const routes: Routes = [
  {
    path: '',
    component: AddInventorySlidePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddInventorySlidePageRoutingModule {}
