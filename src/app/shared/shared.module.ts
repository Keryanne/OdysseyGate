import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchButtonComponent } from '../components/search-button/search-button.component';
import { FormsModule } from '@angular/forms';
import { SearchModalComponent } from '../components/search-modal/search-modal.component';

@NgModule({
  declarations: [SearchButtonComponent, SearchModalComponent], // Déclare SearchButtonComponent ici uniquement
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [SearchButtonComponent, SearchModalComponent] // Permet de l'utiliser dans d'autres modules
})
export class SharedModule { }
