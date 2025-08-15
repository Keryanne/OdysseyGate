import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchButtonComponent } from '../components/search-button/search-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModalComponent } from '../components/search-modal/search-modal.component';
import { TripTransportListComponent } from '../components/trip-transport-list/trip-transport-list.component';
import { TransportFormComponent } from "../components/forms/transport-form/transport-form.component";
import { TripLogementListComponent } from '../components/trip-logement-list/trip-logement-list.component';
import { LogementFormComponent } from '../components/forms/logement-form/logement-form.component';

@NgModule({
  declarations: [SearchButtonComponent, SearchModalComponent, TripTransportListComponent, TripLogementListComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TransportFormComponent,
    LogementFormComponent
],
  exports: [SearchButtonComponent, SearchModalComponent, TripTransportListComponent, TripLogementListComponent]
})
export class SharedModule { }
