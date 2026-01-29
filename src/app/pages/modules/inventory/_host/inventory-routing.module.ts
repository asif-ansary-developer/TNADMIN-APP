import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPage } from './inventory.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: InventoryPage,
  // },

  {
    path: '',
    redirectTo: 'add-inventory',
    pathMatch: 'full',
  },

  {
    path: 'add-inventory',
    loadChildren: () =>
      import('../add-inventory/add-inventory.module').then(
        (m) => m.AddInventoryPageModule
      ),
  },
  {
    path: 'add-inventory-slide',
    loadChildren: () =>
      import('../add-inventory-slide/add-inventory-slide.module').then(
        (m) => m.AddInventorySlidePageModule
      ),
  },
  {
    path: 'filter',
    loadChildren: () =>
      import('../filter/filter.module').then((m) => m.FilterPageModule),
  },
  {
    path: 'preview',
    loadChildren: () =>
      import('../preview/preview.module').then((m) => m.PreviewPageModule),
  },
  {
    path: 'inventory-map',
    loadChildren: () =>
      import('../inventory-map/inventory-map.module').then(
        (m) => m.InventoryMapPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryPageRoutingModule {}
