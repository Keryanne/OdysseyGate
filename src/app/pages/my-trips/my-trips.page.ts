import { Component } from '@angular/core';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';
import { TripsService } from 'src/app/services/trips.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.page.html',
  styleUrls: ['./my-trips.page.scss'],
})
export class MyTripsPage {
  trips: any[] = [];
  images: { [key: string]: string } = {};

  constructor( private pixabayService: PixabayService, private router: Router, private tripsService: TripsService, private authService: AuthService) { }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ionViewWillEnter() {
    this.loadTrips();
  }

  loadTrips() {
    this.tripsService.getVoyages().subscribe((data) => {
      this.trips = data;
      this.loadImages();
    });
  }

   loadImages() {
    this.trips.forEach(trip => {
      const key = trip.destination;
      if (this.images[key]) return;
      this.pixabayService.getImages(key).subscribe(response => {
        this.images[key] = response?.hits?.[0]?.webformatURL || 'assets/no-image.png';
      });
    });
  }

  openTripDetails(trip: any) {
    this.router.navigate(['/tabs/trip-details', trip.id]);
  }

  addTrip() {
    this.router.navigate(['/tabs/add-trip']);
  }

}
