import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReliefCampPageRoutingModule } from './relief-camp-routing.module';

import { ReliefCampPage } from './relief-camp.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    ReliefCampPageRoutingModule,
  ],
  declarations: [ReliefCampPage],
})
export class ReliefCampPageModule {}
