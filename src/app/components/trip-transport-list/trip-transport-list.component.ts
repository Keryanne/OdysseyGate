import { Component, Input, OnInit } from '@angular/core';
import { Transport } from 'src/app/models/transport.model';
import { TripsService } from 'src/app/services/trips.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-trip-transport-list',
  templateUrl: './trip-transport-list.component.html',
  styleUrls: ['./trip-transport-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(80, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ])
  ]
})
export class TripTransportListComponent implements OnInit {

  @Input() tripId: number = 0;
  transports: Transport[] = [];
  showSingleTransportForm = false;
  showUpdateTransportForm = false;
  selectedTransport: Transport[] = [];
  animationState = 'void';

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    if (this.tripId) {
      this.tripsService.getTransportsByVoyage(this.tripId).subscribe({
        next: (data) => {
          this.transports = data;
          // Déclencher l'animation après le chargement des données
          setTimeout(() => {
            this.animationState = 'active';
          }, 100);
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
          // Réinitialiser l'état d'animation pour déclencher l'effet stagger
          this.animationState = 'void';
          
          // Ajouter le transport avec un délai pour permettre le reset de l'animation
          setTimeout(() => {
            this.transports.push(created);
            this.animationState = 'active';
          }, 10);
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
