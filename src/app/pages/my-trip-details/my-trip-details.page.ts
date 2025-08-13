import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TripsService } from 'src/app/services/trips.service';
import { Transport } from 'src/app/models/transport.model';
import { Voyage } from 'src/app/models/trips.model';
import { Logement } from 'src/app/models/logement.model';
import { Activity } from 'src/app/models/activity.model';

@Component({
  selector: 'app-my-trip-details',
  templateUrl: './my-trip-details.page.html',
  styleUrls: ['./my-trip-details.page.scss'],
})
export class MyTripDetailsPage implements OnInit {

  tripId!: number;
  trip!: Voyage;
  city: string = '';
  transports: Transport[] = [];
  logements: Logement[] = [];
  activites: Activity[] = [];

  tabs = [
    { key: 'transports', label: 'Transport' },
    { key: 'logements', label: 'Logements' },
    { key: 'activites', label: 'Activités' },
  ];
  selectedTab = this.tabs[0];
  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute, private alertController: AlertController, private router: Router, private tripsService: TripsService) {}

  ngOnInit() {
    this.tripId = +this.route.snapshot.paramMap.get('id')!;

    this.tripsService.getVoyageById(this.tripId).subscribe({
      next: (res) => {
        this.trip = res;
        this.city = res.destination;
      },
      error: (err) => console.error('Erreur voyage:', err)
    });
  }

  selectTab(tab: any) {
    this.selectedTab = tab;
    this.selectedTabIndex = this.tabs.findIndex(t => t.key === tab.key);
  }

  getTransform() {
    return `translateX(-${this.selectedTabIndex * 100}%)`;
  }

  async presentDeleteAlert(nomVoyage: string) {
    const alert = await this.alertController.create({
      header: `Voulez-vous supprimer le voyage en direction de ${nomVoyage} ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'alert-cancel-btn'
        },
        {
          text: 'Supprimer',
          role: 'confirm',
          cssClass: 'alert-delete-btn',
          handler: () => {
            // Action de suppression ici
            this.tripsService.removeVoyage(this.tripId).subscribe({
              next: () => {
                console.log('Suppression confirmée');
                this.router.navigate(['/tabs/my-trips']);
              },
              error: (err) => {
                console.error('Erreur lors de la suppression:', err);
              }
            });
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }
}
