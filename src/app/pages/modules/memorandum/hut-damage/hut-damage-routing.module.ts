import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HutDamagePage } from './hut-damage.page';

const routes: Routes = [
  {
    path: '',
    component: HutDamagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HutDamagePageRoutingModule {}
