import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReliefCampPage } from './relief-camp.page';

const routes: Routes = [
  {
    path: '',
    component: ReliefCampPage
  },
  {
    path: 'shelter-list',
    loadChildren: () => import('./shelter-list/shelter-list.module').then( m => m.ShelterListPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReliefCampPageRoutingModule {}
