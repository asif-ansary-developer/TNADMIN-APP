import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergencyCallRegPageRoutingModule } from './emergency-call-reg-routing.module';

import { EmergencyCallRegPage } from './emergency-call-reg.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    EmergencyCallRegPageRoutingModule,
  ],
  declarations: [EmergencyCallRegPage],
})
export class EmergencyCallRegPageModule {}
