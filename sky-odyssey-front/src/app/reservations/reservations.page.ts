import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {
  upcomingReservations: any[] = [];
  pastReservations: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.authService.getReservations().subscribe((data) => {
        const currentDate = new Date();
        this.upcomingReservations = data.filter(reservation => {
          const reservationDate = new Date(reservation.date);
          return reservationDate >= currentDate;
        });
        this.pastReservations = data.filter(reservation => new Date(reservation.date) < currentDate);
      });
    }
  }
}
