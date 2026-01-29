import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HutDamagePageRoutingModule } from './hut-damage-routing.module';

import { HutDamagePage } from './hut-damage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HutDamagePageRoutingModule
  ],
  declarations: [HutDamagePage]
})
export class HutDamagePageModule {}
