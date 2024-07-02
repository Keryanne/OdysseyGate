import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, AlertController  } from '@ionic/angular';
// import { StripeService } from '../services/stripe.service';
import { PaymentComponent } from '../payment/payment.component';
import { ReservationService } from '../services/reservation.service';
import { FlightService } from '../services/flight.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {
  isLoggedIn: boolean = false;

  adults: number = 0;
  children: number = 0;
  babies: number = 0;

  startDate: Date | null = null;
  endDate: Date | null = null;
  numberOfNights: number = 0;

  tempStartDate: Date | null = null;
  tempEndDate: Date | null = null;

  tempAdults: number = 0;
  tempChildren: number = 0;
  tempBabies: number = 0;

  property: any;

  userId: number | null = null; // Initialisez userId
  locationId: number | null = null;

  flights: any[] = [];
  selectedFlights: any[] = [];
  tempSelectedFlights: any[] = [];
  totalPriceWithFlight: number = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    // private stripeService: StripeService,
    private alertController: AlertController,
    private reservationService: ReservationService,
    private flightService: FlightService,
    private locationService: LocationService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const tokenUserId = this.authService.getUserIdFromToken();
      console.log('Token',tokenUserId);
      this.userId = tokenUserId;
      // if (tokenUserId) {
      //   this.authService.getUserById(tokenUserId).subscribe(
      //     (user) => {
      //       this.userId = user.id;
      //       console.log('User ID:', this.userId); // Debugging line
      //     },
      //     (error) => {
      //       console.error('Error fetching user ID', error);
      //     }
      //   );
      // }
    }

    const idParam = this.route.snapshot.paramMap.get('propertyId');
    if (idParam !== null) {
     this.locationId = +idParam;
      this.locationService.getLocationById(this.locationId ).subscribe(
        (data) => {
          this.property = data;
          if (this.property.id) {
            this.getFlights(this.property.id);
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

  getFlights(propertyId: number) {
    this.flightService.getFlightsByCity(propertyId).subscribe(
      (data) => {
        this.flights = data;
        this.flights.forEach(flight => flight.selected = false);
      },
      (error) => {
        console.error('Error fetching flights', error);
      }
    );
  }

  increment(type: string) {
    if (type === 'adults') {
      this.adults++;
    } else if (type === 'children') {
      this.children++;
    } else if (type === 'babies') {
      this.babies++;
    }
  }

  decrement(type: string) {
    if (type === 'adults' && this.adults > 0) {
      this.adults--;
    } else if (type === 'children' && this.children > 0) {
      this.children--;
    } else if (type === 'babies' && this.babies > 0) {
      this.babies--;
    }
  }

  incrementTemp(type: string) {
    if (type === 'adults') {
      this.tempAdults++;
    } else if (type === 'children') {
      this.tempChildren++;
    } else if (type === 'babies') {
      this.tempBabies++;
    }
  }

  decrementTemp(type: string) {
    if (type === 'adults' && this.tempAdults > 0) {
      this.tempAdults--;
    } else if (type === 'children' && this.tempChildren > 0) {
      this.tempChildren--;
    } else if (type === 'babies' && this.tempBabies > 0) {
      this.tempBabies--;
    }
  }

  saveTravelers() {
    this.adults = this.tempAdults;
    this.children = this.tempChildren;
    this.babies = this.tempBabies;
    this.modalController.dismiss();
  }

  cancelTravelers() {
    this.modalController.dismiss();
  }

  openTravelersModal() {
    this.tempAdults = this.adults;
    this.tempChildren = this.children;
    this.tempBabies = this.babies;
  }

  openDateModal() {
    this.tempStartDate = this.startDate;
    this.tempEndDate = this.endDate;
  }

  updateTempStartDate(event: any) {
    this.tempStartDate = new Date(event.detail.value);
  }

  updateTempEndDate(event: any) {
    this.tempEndDate = new Date(event.detail.value);
  }

  saveDates() {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.calculateNumberOfNights();
    this.modalController.dismiss();
  }

  calculateNumberOfNights() {
    if (this.startDate && this.endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      this.numberOfNights = Math.round(Math.abs((this.endDate.getTime() - this.startDate.getTime()) / oneDay));
    }
  }

  cancelDates() {
    this.modalController.dismiss();
  }

  async confirmAndPay() {
    const totalPrice = this.calculateTotalPrice();
    const amount = totalPrice * 100; // Convert to cents

    const modal = await this.modalController.create({
      component: PaymentComponent,
      componentProps: { amount }
    });

    modal.onDidDismiss().then(async (data) => {
      if (data.data && data.data.success) {
        await this.saveReservation(totalPrice);
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Payment successful and reservation saved!',
          buttons: ['OK']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Payment Failed',
          message: 'Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });

    await modal.present();
  }

  openFlightsModal() {
    // this.tempSelectedFlights = this.selectedFlights;
  }

  saveFlights() {
    // this.selectedFlights = this.tempSelectedFlights;
    this.selectedFlights = this.flights.filter(flight => flight.selected);
    console.log('Vol sélectionné :', this.selectedFlights);
    this.modalController.dismiss();
  }

  cancelFlights() {
    this.modalController.dismiss();
  }

  calculateFlightPrice(): number {
    return this.selectedFlights.reduce((total, flight) => total + flight.price, 0);
  }

  calculateTotalPrice(): number {
    const flightPrice = this.selectedFlights.reduce((total, flight) => total + flight.price, 0);
    this.totalPriceWithFlight = (this.property.price * this.numberOfNights) + flightPrice;
    return this.totalPriceWithFlight
  }

   async saveReservation(totalPrice: number) {
    const reservation = {
      startDate: this.startDate,
      endDate: this.endDate,
      numberOfGuests: this.adults + this.children + this.babies,
      totalPrice: totalPrice,
      userId: this.userId,
      // userId: 13,
      locationIds: [this.locationId],
      flightIds: this.selectedFlights.map(flight => flight.id), // Ajouter les IDs des vols
    };
    console.log(reservation);

    this.reservationService.createReservation(reservation).subscribe(
      (response) => {
        console.log('Reservation created successfully', response);
      },
      (error) => {
        console.error('Error creating reservation', error);
      }
    );
  }


  navigateToLogin() {
    this.router.navigate(['/tabs/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/tabs/signup']);
  }
}
