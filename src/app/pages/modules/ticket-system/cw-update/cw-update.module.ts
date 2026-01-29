import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CwUpdatePageRoutingModule } from './cw-update-routing.module';

import { CwUpdatePage } from './cw-update.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    CwUpdatePageRoutingModule,
  ],
  declarations: [CwUpdatePage],
  providers: [],
})
export class CwUpdatePageModule {}
