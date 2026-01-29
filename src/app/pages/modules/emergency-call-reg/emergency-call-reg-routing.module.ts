import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmergencyCallRegPage } from './emergency-call-reg.page';

const routes: Routes = [
  {
    path: '',
    component: EmergencyCallRegPage
  },
  {
    path: 'respond',
    loadChildren: () => import('./respond/respond.module').then( m => m.RespondPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmergencyCallRegPageRoutingModule {}
