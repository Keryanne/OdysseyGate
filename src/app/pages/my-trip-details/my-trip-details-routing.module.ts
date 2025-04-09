import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTripDetailsPage } from './my-trip-details.page';

const routes: Routes = [
  {
    path: '',
    component: MyTripDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTripDetailsPageRoutingModule {}
