import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryMapPage } from './inventory-map.page';

const routes: Routes = [
  {
    path: '',
    component: InventoryMapPage
  },
  {
    path: 'inventory-filter',
    loadChildren: () => import('./inventory-filter/inventory-filter.module').then( m => m.InventoryFilterPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryMapPageRoutingModule {}
