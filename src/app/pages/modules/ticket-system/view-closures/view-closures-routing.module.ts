import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewClosuresPage } from './view-closures.page';

const routes: Routes = [
  {
    path: '',
    component: ViewClosuresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewClosuresPageRoutingModule {}
