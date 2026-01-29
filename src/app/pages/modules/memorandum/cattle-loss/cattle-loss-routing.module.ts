import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CattleLossPage } from './cattle-loss.page';

const routes: Routes = [
  {
    path: '',
    component: CattleLossPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CattleLossPageRoutingModule {}
