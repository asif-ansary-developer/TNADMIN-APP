import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CwUpdatePage } from './cw-update.page';

const routes: Routes = [
  {
    path: '',
    component: CwUpdatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CwUpdatePageRoutingModule {}
