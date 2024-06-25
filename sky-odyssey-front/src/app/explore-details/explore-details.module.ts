import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreDetailsPage } from './explore-details.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ExploreDetailsPageRoutingModule } from './explore-details-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExploreDetailsPageRoutingModule
  ],
  declarations: [ExploreDetailsPage]
})
export class ExploreDetailsPageModule {}
