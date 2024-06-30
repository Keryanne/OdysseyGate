import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { FlightService } from '../services/flight.service';

@Component({
  selector: 'app-explore-details',
  templateUrl: 'explore-details.page.html',
  styleUrls: ['explore-details.page.scss']
})
export class ExploreDetailsPage implements OnInit {

  property: any;
  flights: any[] = [];
  totalPrice: number = 0;

  constructor(private route: ActivatedRoute, private router: Router,  private locationService: LocationService, private flightService: FlightService) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam;
      this.locationService.getLocationById(id).subscribe(
        (data) => {
          this.property = data;
          if (this.property.city) {
            this.getFlights(this.property.city);
          }
        },
        (error) => {
          console.error('Error fetching location', error);
          // Gérer le cas où l'ID est invalide ou la location n'est pas trouvée
        }
      );
    } else {
      console.error('ID de propriété non valide');
      // Vous pouvez rediriger l'utilisateur ou afficher un message d'erreur
    }
  }

  openReservation(propertyId: number) {
    this.router.navigate(['/tabs/reservation', propertyId]);
  }

  getFlights(city: string) {
    this.flightService.getFlightsByCity(city).subscribe(
      (data: { departureTime: string; arrivalTime: string; price: number; }[]) => {
        this.flights = data.map((flight: { departureTime: string; arrivalTime: string; price: number; }) => ({
          ...flight,
          duration: this.calculateFlightDuration(flight.departureTime, flight.arrivalTime),
          totalPrice: this.calculateTotalPrice(flight.price)
        }));
      },
      (error: any) => {
        console.error('Error fetching flights', error);
      }
    );
  }

  calculateFlightDuration(departureTime: string, arrivalTime: string): string {
    const departure = new Date(`1970-01-01T${departureTime}`);
    const arrival = new Date(`1970-01-01T${arrivalTime}`);
    const durationInMs = arrival.getTime() - departure.getTime();
    const durationInMinutes = durationInMs / (1000 * 60);

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  calculateTotalPrice(flightPrice: number): number {
    this.totalPrice = this.property.price + flightPrice;
    return this.totalPrice
  }

}
