import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShelterListPageRoutingModule } from './shelter-list-routing.module';

import { ShelterListPage } from './shelter-list.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    ShelterListPageRoutingModule,
  ],
  declarations: [ShelterListPage],
})
export class ShelterListPageModule {}
