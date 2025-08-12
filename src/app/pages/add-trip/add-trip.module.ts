import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTripPageRoutingModule } from './add-trip-routing.module';

import { AddTripPage } from './add-trip.page';
import { TransportFormComponent } from "src/app/components/forms/transport-form/transport-form.component";
import { LogementFormComponent } from "src/app/components/forms/logement-form/logement-form.component";
import { ActivityFormComponent } from "src/app/components/forms/activity-form/activity-form.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTripPageRoutingModule,
    ReactiveFormsModule,
    TransportFormComponent,
    LogementFormComponent,
    ActivityFormComponent
],
  declarations: [AddTripPage]
})
export class AddTripPageModule {}
