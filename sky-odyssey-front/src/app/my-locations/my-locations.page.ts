import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-locations',
  templateUrl: './my-locations.page.html',
  styleUrls: ['./my-locations.page.scss'],
})
export class MyLocationsPage implements OnInit {
  locations: any[] = [];

  constructor(private locationService: LocationService, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.locationService.getLocationById(userId).subscribe(
        (data) => {
          this.locations = data;
        },
        (error) => {
          console.error('Error fetching locations', error);
        }
      );
    }
  }

  editLocation(locationId: number) {
    // Naviguer vers la page de modification avec l'ID de la location
  }

  deleteLocation(locationId: number) {
    this.locationService.deleteLocation(locationId).subscribe(
      () => {
        this.locations = this.locations.filter(location => location.id !== locationId);
      },
      (error) => {
        console.error('Error deleting location', error);
      }
    );
  }
}
