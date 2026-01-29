import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DistrictSelectorPageRoutingModule } from './district-selector-routing.module';

import { DistrictSelectorPage } from './district-selector.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DistrictSelectorPageRoutingModule,
  ],
  declarations: [DistrictSelectorPage],
})
export class DistrictSelectorPageModule {}
