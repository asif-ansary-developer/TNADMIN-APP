import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaintenancePageRoutingModule } from './maintenance-routing.module';

import { MaintenancePage } from './maintenance.page';
import { SwiperModule } from 'swiper/angular';
import { FilterPageModule } from './filter/filter.module';
import { PreviewPage } from './preview/preview.page';
import { PreviewPageModule } from './preview/preview.module';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaintenancePageRoutingModule,
    SwiperModule,
    FilterPageModule,
    ReactiveFormsModule,
    PreviewPageModule,
  ],
  providers: [LocationAccuracy],
  declarations: [MaintenancePage],
})
export class MaintenancePageModule {}
