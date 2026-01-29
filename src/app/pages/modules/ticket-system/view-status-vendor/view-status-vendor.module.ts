import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatusVendorPageRoutingModule } from './view-status-vendor-routing.module';

import { ViewStatusVendorPage } from './view-status-vendor.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewStatusVendorPageRoutingModule,
  ],
  declarations: [ViewStatusVendorPage],
})
export class ViewStatusVendorPageModule {}
