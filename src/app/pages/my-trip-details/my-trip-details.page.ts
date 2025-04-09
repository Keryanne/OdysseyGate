import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tripDetails } from './trip-details.mock';
import { AlertController } from '@ionic/angular';
// import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone';

@Component({
  // standalone: true,
  selector: 'app-my-trip-details',
  templateUrl: './my-trip-details.page.html',
  styleUrls: ['./my-trip-details.page.scss'],
  // imports: [],
})
export class MyTripDetailsPage implements OnInit {

  tripId!: number;
  trip: any;

  transports: any[] = [];
  logements: any[] = [];
  activites: any[] = [];
  city: string = '';

  tabs = [
    { key: 'transports', label: 'Transport' },
    { key: 'logements', label: 'Logements' },
    { key: 'activites', label: 'Activités' },
  ];
  selectedTab = this.tabs[0];
  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute, private alertController: AlertController, private router: Router) {}

  ngOnInit() {
    this.tripId = +this.route.snapshot.paramMap.get('id')!;

    this.trip = (tripDetails as { [key: number]: typeof tripDetails[1] })[this.tripId];

    if (this.trip) {
      this.transports = this.trip.transports || [];
      this.logements = this.trip.logements || [];
      this.activites = this.trip.activites || [];
    }

    this.city = this.getCityNameById(this.tripId);
  }
  getCityNameById(id: number): string {
    switch (id) {
      case 1: return 'Paris';
      case 2: return 'Seoul';
      case 3: return 'New York';
      case 4: return 'Tokyo';
      case 5: return 'Rome';
      default: return 'Inconnu';
    }
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
            console.log('Suppression confirmée');
            this.router.navigate(['/tabs/my-trips']);
          }
        }
      ],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }
}
