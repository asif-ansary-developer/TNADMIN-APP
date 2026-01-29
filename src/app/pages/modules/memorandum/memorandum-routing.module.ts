import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemorandumPage } from './memorandum.page';

const routes: Routes = [
  {
    path: '',
    component: MemorandumPage,
  },
  {
    path: 'agriculture',
    loadChildren: () =>
      import('./agriculture/agriculture.module').then(
        (m) => m.AgriculturePageModule
      ),
  },
  {
    path: 'horticulture',
    loadChildren: () =>
      import('./horticulture/horticulture.module').then(
        (m) => m.HorticulturePageModule
      ),
  },
  {
    path: 'sericulture',
    loadChildren: () =>
      import('./sericulture/sericulture.module').then(
        (m) => m.SericulturePageModule
      ),
  },
  {
    path: 'human-loss',
    loadChildren: () =>
      import('./human-loss/human-loss.module').then(
        (m) => m.HumanLossPageModule
      ),
  },

  {
    path: 'human-injury',
    loadChildren: () =>
      import('./human-injury/human-injury.module').then(
        (m) => m.HumanInjuryPageModule
      ),
  },
  {
    path: 'relief-camp',
    loadChildren: () =>
      import('./relief-camp/relief-camp.module').then(
        (m) => m.ReliefCampPageModule
      ),
  },

  {
    path: 'hut-damage',
    loadChildren: () =>
      import('./hut-damage/hut-damage.module').then(
        (m) => m.HutDamagePageModule
      ),
  },
  {
    path: 'cattle-loss',
    loadChildren: () =>
      import('./cattle-loss/cattle-loss.module').then(
        (m) => m.CattleLossPageModule
      ),
  },
  {
    path: 'road',
    loadChildren: () => import('./road/road.module').then( m => m.RoadPageModule)
  },
  {
    path: 'bridges',
    loadChildren: () => import('./bridges/bridges.module').then( m => m.BridgesPageModule)
  },
  {
    path: 'culverts',
    loadChildren: () => import('./culverts/culverts.module').then( m => m.CulvertsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemorandumPageRoutingModule {}
