import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'cities',
  //   loadChildren: () => import('./pages/cities/cities.module').then( m => m.CitiesPageModule) FEATURES IN PROGRESS
  // },
  {
    path: 'my-travels',
    loadChildren: () => import('./pages/my-trips/my-trips.module').then( m => m.MyTripsPageModule)
  },
  {
    path: 'my-trip-details',
    loadChildren: () => import('./pages/my-trip-details/my-trip-details.module').then( m => m.MyTripDetailsPageModule)
  },
  {
    path: 'add-trip',
    loadChildren: () => import('./pages/add-trip/add-trip.module').then( m => m.AddTripPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
