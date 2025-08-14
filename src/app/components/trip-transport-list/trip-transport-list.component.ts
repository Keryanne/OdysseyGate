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
  showSingleTransportForm = false;
  showUpdateTransportForm = false;
  selectedTransport: Transport[] = [];

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    if (this.tripId) {
      this.tripsService.getTransportsByVoyage(this.tripId).subscribe({
        next: (data) => {
          this.transports = data;
        },
        error: (err) => {
          console.error('Erreur chargement transports :', err);
        },
      });
    }  
  }

  openSingleTransportForm() {
    this.showSingleTransportForm = true;
  }

  handleAddTransportModal(event: any) {
    this.showSingleTransportForm = false;
    const data = event?.detail?.data;
    if (data && !data.update && data.transports && data.transports.length > 0) {
      console.log('Nouveau transport ajouté :', data.transports);
      this.onSingleTransportAdded(data.transports);
    }
  }

  onSingleTransportAdded(transports: Transport[]) {
    if (transports && transports.length > 0) {
      const newTransport = transports[0];
      this.tripsService.addTransport(this.tripId, newTransport).subscribe({
        next: (created) => {
          this.transports.push(created); // Ajoute le transport retourné par l'API
        },
        error: (err) => {
          console.error('Erreur ajout transport :', err);
        }
      });
    }
    this.showSingleTransportForm = false;
  }

  deleteTransport(transportId: number) {
    this.tripsService.removeTransport(transportId).subscribe({
      next: () => {
        this.transports = this.transports.filter(t => t.id !== transportId);
      },
      error: (err) => {
        console.error('Erreur suppression transport :', err);
      }
    });
  }

  editTransport(transportId: number) {
    const transport = this.transports.find(t => t.id === transportId);
    if (transport) {
      this.selectedTransport = [transport];
      this.showUpdateTransportForm = true;
    }
  }

  handleUpdateTransportModal(event: any) {
    this.showUpdateTransportForm = false;
    const data = event?.detail?.data;
    if (data && data.update && data.transports && data.transports.length > 0) {
      this.onUpdateTransport(data.transports);
    }
  }

  onUpdateTransport(transports: Transport[]) {
    console.log('Mise à jour du transport :', transports);
    if (transports && transports.length > 0) {
      const updatedTransport = transports[0];
      this.tripsService.updateTransport(updatedTransport.id!, updatedTransport).subscribe({
        next: (updated) => {
          const index = this.transports.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.transports[index] = updated;
          }
        },
        error: (err) => {
          console.error('Erreur mise à jour transport :', err);
        }
      });
    }
    this.showUpdateTransportForm = false;
  }
}
