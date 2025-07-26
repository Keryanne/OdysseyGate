import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorePage } from './explore.page';

import { ExplorePageRoutingModule } from './explore-routing.module';
import { SharedModule } from '../shared/shared.module';
import { share } from 'rxjs';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExplorePageRoutingModule,
    SharedModule
  ],
  declarations: [ExplorePage]
})
export class ExplorePageModule {}
