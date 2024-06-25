import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: 'reservation.page.html',
  styleUrls: ['reservation.page.scss']
})

export class ReservationPage {
    adults: number = 2;
    children: number = 0;
    babies: number = 0;
    
    constructor() {}

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
}
