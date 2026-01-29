import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CulvertsPage } from './culverts.page';

const routes: Routes = [
  {
    path: '',
    component: CulvertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CulvertsPageRoutingModule {}
