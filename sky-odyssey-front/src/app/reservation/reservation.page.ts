import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

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

  constructor(private authService: AuthService, private router: Router, private modalController: ModalController) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
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

  navigateToLogin() {
    this.router.navigate(['/tabs/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/tabs/signup']);
  }
}
