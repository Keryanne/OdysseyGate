import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTripDetailsPageRoutingModule } from './my-trip-details-routing.module';

import { MyTripDetailsPage } from './my-trip-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTripDetailsPageRoutingModule
  ],
  declarations: [MyTripDetailsPage]
})
export class MyTripDetailsPageModule {}
