import { Component, Input, OnInit } from '@angular/core';
import { tripDetails } from 'src/app/pages/my-trip-details/trip-details.mock';

@Component({
  selector: 'app-trip-transport-list',
  templateUrl: './trip-transport-list.component.html',
  styleUrls: ['./trip-transport-list.component.scss'],
})
export class TripTransportListComponent  implements OnInit {

  @Input() tripId: number = 0;
  transports: any[] = [];

  ngOnInit() {
    if (this.tripId && tripDetails[this.tripId]) {
      console.log('tripDetails', tripDetails[this.tripId]);
      this.transports = tripDetails[this.tripId].transports;
    }
  }

}
