import { Component, OnInit } from '@angular/core';
import { trips } from './mock-trips';
import { PixabayService } from 'src/app/services/pixabay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-trips',
  templateUrl: './my-trips.page.html',
  styleUrls: ['./my-trips.page.scss'],
})
export class MyTripsPage implements OnInit {
  trips = trips;
  images: { [key: string]: string } = {};

  constructor( private pixabayService: PixabayService, private router: Router,) { }

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.trips.forEach(trip => {
      this.pixabayService.getImages(trip.city).subscribe(response => {
        if (response.hits.length > 0) {
          this.images[trip.city] = response.hits[0].webformatURL; // Prend la première image trouvée
        } else {
          this.images[trip.city] = 'assets/no-image.png'; // Image par défaut
        }
      });
    });
  }

  openTripDetails(trip: any) {
    this.router.navigate(['/tabs/trip-details', trip.id]);
  }

}
