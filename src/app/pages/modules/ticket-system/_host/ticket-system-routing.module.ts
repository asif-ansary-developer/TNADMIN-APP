import { ViewStatusAdminPageModule } from './../view-status-admin/view-status-admin.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TicketSystemPage } from './ticket-system.page';

const routes: Routes = [
  {
    path: '',
    component: TicketSystemPage,
  },

  {
    path: 'station-list',
    loadChildren: () =>
      import('../station-list/station-list.module').then(
        (m) => m.StationListPageModule
      ),
  },
  {
    path: 'raise-ticket',
    loadChildren: () =>
      import('../raise-ticket/raise-ticket.module').then(
        (m) => m.RaiseTicketPageModule
      ),
  },
  {
    path: 'cw-update',
    loadChildren: () =>
      import('../cw-update/cw-update.module').then((m) => m.CwUpdatePageModule),
  },
  {
    path: 'fence-status',
    loadChildren: () =>
      import('../fence-status/fence-status.module').then(
        (m) => m.FenceStatusPageModule
      ),
  },
  {
    path: 'fence-update',
    loadChildren: () =>
      import('../fence-update/fence-update.module').then(
        (m) => m.FenceUpdatePageModule
      ),
  },
  {
    path: 'view-status-vendor',
    loadChildren: () =>
      import('../view-status-vendor/view-status-vendor.module').then(
        (m) => m.ViewStatusVendorPageModule
      ),
  },
  {
    path: 'view-status-admin',
    loadChildren: () =>
      import('../view-status-admin/view-status-admin.module').then(
        (m) => m.ViewStatusAdminPageModule
      ),
  },
  {
    path: 'view-status-admin-2',
    loadChildren: () =>
      import('../view-status-admin-2/view-status-admin-2.module').then(
        (m) => m.ViewStatusAdmin2PageModule
      ),
  },
  {
    path: 'ticket-raiser-action',
    loadChildren: () =>
      import('../ticket-raiser-action/ticket-raiser-action.module').then(
        (m) => m.TicketRaiserActionPageModule
      ),
  },
  {
    path: 'ticket-resolver-action',
    loadChildren: () =>
      import('../ticket-resolver-action/ticket-resolver-action.module').then(
        (m) => m.TicketResolverActionPageModule
      ),
  },
  {
    path: 'visit-list',
    loadChildren: () =>
      import('../visit-list/visit-list.module').then(
        (m) => m.VisitListPageModule
      ),
  },
  {
    path: 'view-closures',
    loadChildren: () =>
      import('../view-closures/view-closures.module').then(
        (m) => m.ViewClosuresPageModule
      ),
  },

  {
    path: 'view-actions-hq',
    loadChildren: () =>
      import('../view-actions-hq/view-actions-hq.module').then(
        (m) => m.ViewActionsHqPageModule
      ),
  },
  {
    path: 'ticket-viewer',
    loadChildren: () =>
      import('../ticket-viewer/ticket-viewer.module').then(
        (m) => m.TicketViewerPageModule
      ),
  },

  {
    path: 'arg-complaints',
    loadChildren: () =>
      import('../arg-complaints/arg-complaints.module').then(
        (m) => m.ArgComplaintsPageModule
      ),
  },
  {
    path: 'view-complaints',
    loadChildren: () =>
      import('../view-complaints/view-complaints.module').then(
        (m) => m.ViewComplaintsPageModule
      ),
  },
  {
    path: 'view-tickets-ven-master',
    loadChildren: () =>
      import('../view-tickets-ven-master/view-tickets-ven-master.module').then(
        (m) => m.ViewTicketsVenMasterPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketSystemPageRoutingModule {}
