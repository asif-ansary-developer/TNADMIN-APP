import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HumanInjuryPageRoutingModule } from './human-injury-routing.module';

import { HumanInjuryPage } from './human-injury.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HumanInjuryPageRoutingModule
  ],
  declarations: [HumanInjuryPage]
})
export class HumanInjuryPageModule {}
