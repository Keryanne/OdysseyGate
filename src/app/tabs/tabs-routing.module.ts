import { MyTripDetailsPage } from './../pages/my-trip-details/my-trip-details.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guard/auth.guard';
import { AnimationController } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'explore',
        loadChildren: () => import('../explore/explore.module').then(m => m.ExplorePageModule)
      },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'my-trips',
        loadChildren: () => import('../pages/my-trips/my-trips.module').then( m => m.MyTripsPageModule)
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then( m => m.LoginPageModule)
      },
      {
        path: 'register',
        loadChildren: () => import('../signup/signup.module').then( m => m.SignupPageModule)
      },
      {
        path: 'add-location',
        loadChildren: () => import('../add-location/add-location.module').then( m => m.AddLocationPageModule)
      },
      {
        path: 'cities/:code',
        loadChildren: () => import('../pages/cities/cities.module').then( m => m.CitiesPageModule)
      },
      {
        path: 'trip-details/:id',
        loadChildren: () => import('../pages/my-trip-details/my-trip-details.module').then( m => m.MyTripDetailsPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/explore',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
