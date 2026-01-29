import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WeatherModelSelectorPageRoutingModule } from './weather-model-selector-routing.module';

import { WeatherModelSelectorPage } from './weather-model-selector.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WeatherModelSelectorPageRoutingModule
  ],
  declarations: [WeatherModelSelectorPage]
})
export class WeatherModelSelectorPageModule {}
