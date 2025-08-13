import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchButtonComponent } from '../components/search-button/search-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModalComponent } from '../components/search-modal/search-modal.component';
import { TripTransportListComponent } from '../components/trip-transport-list/trip-transport-list.component';
import { TransportFormComponent } from "../components/forms/transport-form/transport-form.component";

@NgModule({
  declarations: [SearchButtonComponent, SearchModalComponent, TripTransportListComponent], // Déclare SearchButtonComponent ici uniquement
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TransportFormComponent
],
  exports: [SearchButtonComponent, SearchModalComponent, TripTransportListComponent,] // Permet de l'utiliser dans d'autres modules
})
export class SharedModule { }
