import { Component, Injectable, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { TripsService } from 'src/app/services/trips.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.page.html',
  styleUrls: ['./add-trip.page.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(-20px)' }))
      ])
    ])
  ]
})
export class AddTripPage implements OnDestroy {

  step = 1;

  form: FormGroup;

  durations = [
    { label: '30 minutes', value: '00:30' },
    { label: '1 heure', value: '01:00' },
    { label: '1h30', value: '01:30' },
    { label: '2 heures', value: '02:00' },
    { label: '2h30', value: '02:30' },
    { label: '3 heures', value: '03:00' },
  ];
  

  constructor(private fb: FormBuilder, private tripsService: TripsService, private router: Router) {
    this.form = this.fb.group({
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      people: ['', Validators.min(1)],
      departureCity: ['', Validators.required],

      transportType: [''],
      transportNumber: [''],
      transportCompagnie: [''],
      transportStartDate: [''],
      transportEndDate: [''],
      // duration: [''],
      // transportFile: [''],
      transportDeparture: [''],
      transportDestination: [''],

      hotelName: [''],
      // hotelStartDate: [''],
      // hotelEndDate: [''],
      // hotelFile: [''],
      hotelAdress: [''],

      activityName: [''],
      // activityDate: [''],
      activityLocation: [''],
      // activityFile: [''],
    });
    
  }

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  startDate: string | null = '';
  endDate: string | null = '';
  hotelStartDate: string | null = '';
  hotelEndDate: string | null = '';
  transportStartDate: string | null = '';
  transportEndDate: string | null = '';
  activityDate: string | null = '';

  showStartPicker = false;
  showEndPicker = false;
  showTransportStartDatePicker = false;
  showTransportEndDatePicker = false;
  showHotelStartDatePicker = false;
  showHotelEndDatePicker = false;
  showActivityDatePicker = false;

  onStartDateChange(event: any) {
    this.startDate = event.detail.value;
    this.form.patchValue({ startDate: this.startDate });
  }

  onEndDateChange(event: any) {
    this.endDate = event.detail.value;
    this.form.patchValue({ endDate: this.endDate });
  }

  onTransportStartDateChange(event: any) {
    this.transportStartDate = event.detail.value;
    this.form.patchValue({ transportDate: this.transportStartDate });
  }

   onTransportEndDateChange(event: any) {
    this.transportEndDate = event.detail.value;
    this.form.patchValue({ transportDate: this.transportEndDate });
  }

  onHotelStartDateChange(event: any) {
    this.hotelStartDate = event.detail.value;
    this.form.patchValue({ hotelStartDate: this.hotelStartDate });
  }

  onHotelEndDateChange(event: any) {
    this.hotelEndDate = event.detail.value;
    this.form.patchValue({ hotelEndDate: this.hotelEndDate });
  }

  onActivityDateChange(event: any) {
    this.activityDate = event.detail.value;
    this.form.patchValue({ activityDate: this.activityDate });
  }
  
  isStep1Valid(): boolean {
    return !!this.form.get('destination')?.valid &&
           !!this.form.get('departureCity')?.valid &&
           !!this.form.get('startDate')?.valid &&
           !!this.form.get('endDate')?.valid &&
           !!this.form.get('people')?.valid;
  }
  
  submitForm() {
    if (this.isStep1Valid()) {
      console.log('Formulaire valide et prêt à être envoyé :', this.form.value);
      // Tu peux appeler ici ton service d’envoi ou naviguer
      const formValue = this.form.value;

    const payload = {
      destination: formValue.destination,
      dateDepart: formValue.startDate,
      dateArrivee: formValue.endDate,
      nombreVoyageurs: formValue.people,
      villeDepart: formValue.departureCity, 
      imageUrl: 'https://example.com/image.jpg', // à remplacer plus tard par Pixabay ou upload

      transport: {
        type: formValue.transportType,
        numero: formValue.transportNumber,
        compagnie: formValue.transportCompagnie,
        dateDepart: formValue.transportStartDate,
        dateArrivee: formValue.transportEndDate,
        depart: formValue.transportDeparture,
        arrivee: formValue.transportDestination
        // duree: formValue.duration,
        // fichier: formValue.transportFile
      },

      logement: {
        nom: formValue.hotelName,
        adresse: formValue.hotelAdress,
        // dateDebut: formValue.hotelStartDate,
        // dateFin: formValue.hotelEndDate,
        // fichier: formValue.hotelFile
      },

      activite: {
        // nom: formValue.activityName,
        // date: formValue.activityDate,
        description: formValue.activityName,
        lieu: formValue.activityLocation,
        // fichier: formValue.activityFile
      }
    };

    this.tripsService.createVoyage(payload).subscribe({
      next: () => {
        console.log('Voyage créé avec succès !');
        this.resetForm();
        this.router.navigate(['/tabs/my-trips']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du voyage :', err);
      }
    });
    } else {
      console.log('Champs obligatoires manquants');
    }
  }
  
  resetForm() {
    this.form.reset();
    this.step = 1;
    this.startDate = null;
    this.endDate = null;
    this.transportStartDate = null;
    this.transportEndDate = null;
    this.hotelStartDate = null ;
    this.hotelEndDate = null;
  }

  ionViewWillEnter() {
    this.resetForm();
  }

  ngOnDestroy() {
    this.resetForm();
  }
  

}
