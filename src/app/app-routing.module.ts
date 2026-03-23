import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'inventory/inventory-map',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },


  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },

  {
    path: 'splash-screen',
    loadChildren: () =>
      import('./pages/splash-screen/splash-screen.module').then(
        (m) => m.SplashScreenPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/_host/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'overall-statusmap',
    loadChildren: () =>
      import('./pages/modules/overall-statusmap/overall-statusmap.module').then(
        (m) => m.OverallStatusmapPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ticket-system',
    loadChildren: () =>
      import('./pages/modules/ticket-system/_host/ticket-system.module').then(
        (m) => m.TicketSystemPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'raingauge',
    loadChildren: () =>
      import('./pages/modules/raingauge/_host/raingauge.module').then(
        (m) => m.RaingaugePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'district-selector',
    loadChildren: () =>
      import(
        './pages/modules/ticket-system/district-selector/district-selector.module'
      ).then((m) => m.DistrictSelectorPageModule),
  },
  {
    path: 'mis',
    loadChildren: () =>
      import('./pages/modules/mis/mis.module').then((m) => m.MisPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./pages/modules/inventory/_host/inventory.module').then(
        (m) => m.InventoryPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'loc-picker',
    loadChildren: () =>
      import('./pages/modules/inventory/loc-picker/loc-picker.module').then(
        (m) => m.LocPickerPageModule
      ),
  },
  {
    path: 'emergency-call-reg',
    loadChildren: () =>
      import(
        './pages/modules/emergency-call-reg/emergency-call-reg.module'
      ).then((m) => m.EmergencyCallRegPageModule),
  },
  {
    path: 'relief-camp',
    loadChildren: () =>
      import('./pages/modules/relief-camp/relief-camp.module').then(
        (m) => m.ReliefCampPageModule
      ),
  },
  {
    path: 'resolution-alert',
    loadChildren: () =>
      import(
        './pages/modules/ticket-system/resolution-alert/resolution-alert.module'
      ).then((m) => m.ResolutionAlertPageModule),
  },
  {
    path: 'vendor/maintenance',
    loadChildren: () =>
      import('./pages/vendor/maintenance/maintenance.module').then(
        (m) => m.MaintenancePageModule
      ),
  },
  {
    path: 'memorandum',
    loadChildren: () =>
      import('./pages/modules/memorandum/memorandum.module').then(
        (m) => m.MemorandumPageModule
      ),
  },
  {
    path: 'ts',
    loadChildren: () =>
      import('./pages/modules/ts/ts.module').then((m) => m.TsPageModule),
  },
  {
    path: 'view-tickets-ven-master',
    loadChildren: () =>
      import(
        './pages/modules/ticket-system/view-tickets-ven-master/view-tickets-ven-master.module'
      ).then((m) => m.ViewTicketsVenMasterPageModule),
  },
  {
    path: 'weather-model-selector',
    loadChildren: () =>
      import(
        './pages/modules/weather-model-selector/weather-model-selector.module'
      ).then((m) => m.WeatherModelSelectorPageModule),
  },
  {
    path: 'inventory-map',
    loadChildren: () =>
      import(
        './pages/modules/inventory/inventory-map/inventory-map.module'
      ).then((m) => m.InventoryMapPageModule),
  },
  {
    path: 'inventory/inventory-map',
    loadChildren: () =>
      import(
        './pages/modules/inventory/inventory-map/inventory-map.module'
      ).then((m) => m.InventoryMapPageModule),
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
