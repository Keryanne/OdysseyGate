import { Component, Input, OnInit } from '@angular/core';
import { Activity } from 'src/app/models/activity.model';
import { TripsService } from 'src/app/services/trips.service';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-trip-activity-list',
  templateUrl: './trip-activity-list.component.html',
  styleUrls: ['./trip-activity-list.component.scss'],
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
export class TripActivityListComponent implements OnInit {
  @Input() tripId!: number;
  activities: Activity[] = [];
  showSingleActivityForm = false;
  showUpdateActivityForm = false;
  selectedActivity: Activity[] = [];
  animationState = 'void';

  constructor(private tripsService: TripsService) {}

  ngOnInit() {
    if (this.tripId) {
      this.tripsService.getActivitiesByVoyage(this.tripId).subscribe({
        next: (data: Activity[]) => {
          this.activities = data;
          // Déclencher l'animation après le chargement des données
          setTimeout(() => {
            this.animationState = 'active';
          }, 100);
        },
        error: (err: any) => {
          console.error('Erreur chargement activités :', err);
        },
      });
    }  
  }

  openSingleActivityForm() {
    this.showSingleActivityForm = true;
  }

  handleAddActivityModal(event: any) {
    const data = event?.detail?.data;
    if (data && !data.update && data.activities && data.activities.length > 0) {
      this.onSingleActivityAdded(data.activities);
    }
    this.showSingleActivityForm = false;
  }

  onSingleActivityAdded(activities: Activity[]) {
    if (activities && activities.length > 0) {
      const newActivity = activities[0];
      this.tripsService.addActivity(this.tripId, newActivity).subscribe({
        next: (created: Activity) => {
          // Assurez-vous que cette ligne est présente
          this.activities.push(created);
          
          // Ces lignes sont pour l'animation et n'affectent pas le test directement
          this.animationState = 'void';
          setTimeout(() => {
            this.animationState = 'active';
          }, 10);
        },
        error: (err: any) => {
          console.error('Erreur ajout activité :', err);
        }
      });
    }
    this.showSingleActivityForm = false;
  }

  deleteActivity(id: number) {
    this.tripsService.removeActivity(id).subscribe({
      next: () => {
        this.activities = this.activities.filter(item => item.id !== id);
      },
      error: (err: any) => {
        console.error('Erreur suppression activité :', err);
      }
    });
  }

  editActivity(id: number) {
    const activity = this.activities.find(item => item.id === id);
    if (activity) {
      this.selectedActivity = [activity];
      this.showUpdateActivityForm = true;
    }
  }

  handleUpdateActivityModal(event: any) {
    const data = event?.detail?.data;
    if (data && data.update && data.activities) {
      this.onUpdateActivity(data.activities);
    }
    this.showUpdateActivityForm = false;
  }

  onUpdateActivity(activities: Activity[]) {
    if (activities && activities.length > 0) {
      const updatedActivity = activities[0];
      this.tripsService.updateActivity(updatedActivity.id!, updatedActivity).subscribe({
        next: (updated: Activity) => {
          const index = this.activities.findIndex(item => item.id === updated.id);
          if (index !== -1) {
            this.activities[index] = updated;
          }
        },
        error: (err: any) => {
          console.error('Erreur mise à jour activité :', err);
        }
      });
    }
    this.showUpdateActivityForm = false;
  }
}
