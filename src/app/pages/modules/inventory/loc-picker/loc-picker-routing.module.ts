import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocPickerPage } from './loc-picker.page';

const routes: Routes = [
  {
    path: '',
    component: LocPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocPickerPageRoutingModule {}
