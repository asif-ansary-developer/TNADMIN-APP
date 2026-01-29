import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewStatusAdminPageRoutingModule } from './view-status-admin-routing.module';

import { ViewStatusAdminPage } from './view-status-admin.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ViewStatusAdminPageRoutingModule,
  ],
  declarations: [ViewStatusAdminPage],
})
export class ViewStatusAdminPageModule {}
