import { Component, Input, OnInit } from '@angular/core';
import { Logement } from 'src/app/models/logement.model';
import { TripsService } from 'src/app/services/trips.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-trip-logement-list',
  templateUrl: './trip-logement-list.component.html',
  styleUrls: ['./trip-logement-list.component.scss'],
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
  ],
})
export class TripLogementListComponent implements OnInit {
  @Input() tripId!: number;
  logements: Logement[] = [];
  showSingleLogementForm = false;
  showUpdateLogementForm = false;
  selectedLogement: Logement[] = [];
  animationState = 'void';

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    if (this.tripId) {
      this.tripsService.getLogementsByVoyage(this.tripId).subscribe({
        next: (data: Logement[]) => {
          this.logements = data;
          // Déclencher l'animation après le chargement des données
          setTimeout(() => {
            this.animationState = 'active';
          }, 100);
        },
        error: (err: any) => {
          console.error('Erreur chargement logements :', err);
        },
      });
    }  
  }

  openSingleLogementForm() {
    this.showSingleLogementForm = true;
  }

  handleAddLogementModal(event: any) {
    const data = event?.detail?.data;
    if (data && !data.update && data.logements && data.logements.length > 0) {
      this.onSingleLogementAdded(data.logements);
    }
    this.showSingleLogementForm = false;
  }

  onSingleLogementAdded(logements: Logement[]) {
    if (logements && logements.length > 0) {
      const newLogement = logements[0];
      this.tripsService.addLogement(this.tripId, newLogement).subscribe({
        next: (created) => {
          // Assurez-vous que cette ligne est présente
          this.logements.push(created);
          
          // Ces lignes sont pour l'animation et n'affectent pas le test directement
          this.animationState = 'void';
          setTimeout(() => {
            this.animationState = 'active';
          }, 10);
        },
        error: (err) => {
          console.error('Erreur ajout logement :', err);
        }
      });
    }
    this.showSingleLogementForm = false;
  }

  deleteLogement(id: number) {
    this.tripsService.removeLogement(id).subscribe({
      next: () => {
        this.logements = this.logements.filter(item => item.id !== id);
      },
      error: (err: any) => {
        console.error('Erreur suppression logement :', err);
      }
    });
  }

  editLogement(id: number) {
    const logement = this.logements.find(item => item.id === id);
    if (logement) {
      this.selectedLogement = [logement];
      this.showUpdateLogementForm = true;
    }
  }

  handleUpdateLogementModal(event: any) {
    const data = event?.detail?.data;
    if (data && data.update && data.logements) {
      this.onUpdateLogement(data.logements);
    }
    this.showUpdateLogementForm = false;
  }

  onUpdateLogement(logements: Logement[]) {
    if (logements && logements.length > 0) {
      const updatedLogement = logements[0];
      this.tripsService.updateLogement(updatedLogement.id!, updatedLogement).subscribe({
        next: (updated: Logement) => {
          const index = this.logements.findIndex(item => item.id === updated.id);
          if (index !== -1) {
            this.logements[index] = updated;
          }
        },
        error: (err: any) => {
          console.error('Erreur mise à jour logement :', err);
        }
      });
    }
    this.showUpdateLogementForm = false;
  }
}
