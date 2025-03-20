import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { CitiesPageRoutingModule } from './cities-routing.module';

import { CitiesPage } from './cities.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CitiesPageRoutingModule,
    IonicModule,
    SharedModule
],
  declarations: [CitiesPage]
})
export class CitiesPageModule {}
