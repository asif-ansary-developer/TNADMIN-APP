import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShelterListPage } from './shelter-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShelterListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelterListPageRoutingModule {}
