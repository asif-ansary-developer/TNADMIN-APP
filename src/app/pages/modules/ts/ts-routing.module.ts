import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TsPage } from './ts.page';

const routes: Routes = [
  {
    path: '',
    component: TsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'home2',
        loadChildren: () =>
          import('./home2/home2.module').then((m) => m.Home2PageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TsPageRoutingModule {}
