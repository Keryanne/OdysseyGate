import { Component, Input, OnInit } from '@angular/core';
import { Transport } from 'src/app/models/transport.model';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-trip-transport-list',
  templateUrl: './trip-transport-list.component.html',
  styleUrls: ['./trip-transport-list.component.scss'],
})
export class TripTransportListComponent  implements OnInit {

  @Input() tripId: number = 0;
  transports: Transport[] = [];

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    // if (this.tripId && tripDetails[this.tripId]) {
    //   console.log('tripDetails', tripDetails[this.tripId]);
    //   this.transports = tripDetails[this.tripId].transports;
    // }
    if (this.tripId) {
      this.tripsService.getTransportsByVoyage(this.tripId).subscribe({
        next: (data) => {
          this.transports = data;
        },
        error: (err) => {
          console.error('Erreur chargement transports :', err);
        },
      });
    }  }

}
