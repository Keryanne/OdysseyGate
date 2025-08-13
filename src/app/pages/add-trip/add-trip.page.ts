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
import { Transport } from 'src/app/models/transport.model';
import { Logement } from 'src/app/models/logement.model';
import { Activity } from 'src/app/models/activity.model';
import { TransportFormComponent } from 'src/app/components/forms/transport-form/transport-form.component';
import { LogementFormComponent } from 'src/app/components/forms/logement-form/logement-form.component';
import { ActivityFormComponent } from 'src/app/components/forms/activity-form/activity-form.component';

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
  collectedData: any = {};
  form: FormGroup;

  durations = [
    { label: '30 minutes', value: '00:30' },
    { label: '1 heure', value: '01:00' },
    { label: '1h30', value: '01:30' },
    { label: '2 heures', value: '02:00' },
    { label: '2h30', value: '02:30' },
    { label: '3 heures', value: '03:00' },
  ];
  
  @ViewChild(TransportFormComponent) transportFormComponent!: TransportFormComponent;
  @ViewChild(LogementFormComponent) logementFormComponent!: LogementFormComponent;
  @ViewChild(ActivityFormComponent) activityFormComponent!: ActivityFormComponent;

  constructor(private fb: FormBuilder, private tripsService: TripsService, private router: Router) {
    this.form = this.fb.group({
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      people: ['', Validators.min(1)],
      departureCity: ['', Validators.required],

      activityName: [''],
      activityLocation: [''],
    });

     this.collectedData = {
      transport: [],
      logement: {},
      activite: {}
    };
    
  }

  nextStep() {
    if (this.step === 2 && this.transportFormComponent) {
      this.transportFormComponent.submit();
    }
    if (this.step === 3 && this.logementFormComponent) {
      this.logementFormComponent.submit();
    }
    if (this.step === 4 && this.activityFormComponent) {
      this.activityFormComponent.submit();
    }
    
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  startDate: string | null = '';
  endDate: string | null = '';

  showStartPicker = false;
  showEndPicker = false;

  onStartDateChange(event: any) {
    this.startDate = event.detail.value;
    this.form.patchValue({ startDate: this.startDate });
  }

  onEndDateChange(event: any) {
    this.endDate = event.detail.value;
    this.form.patchValue({ endDate: this.endDate });
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
      if (this.transportFormComponent) {
        this.transportFormComponent.submit();
      }
      if (this.logementFormComponent) {
        this.logementFormComponent.submit();
      }
      if (this.activityFormComponent) {
        this.activityFormComponent.submit();
      }

      const formValue = this.form.value;

      const payload = {
        destination: formValue.destination ?? '',
        dateDepart: formValue.startDate ?? '',
        dateArrivee: formValue.endDate ?? '',
        nombreVoyageurs: formValue.people ?? 1,
        villeDepart: formValue.departureCity ?? '',
        imageUrl: 'https://example.com/image.jpg',
        transports: this.collectedData.transport ?? [],
        logements: this.collectedData.logement ?? [],
        activites: this.collectedData.activite ?? []
      };

      this.tripsService.createVoyage(payload).subscribe({
        next: () => {
          console.log('Voyage créé avec succès ! ', payload);
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
    this.collectedData = {
      transport: [],
      logement: [],
      activite: []
    };
  }

  ionViewWillEnter() {
    this.resetForm();
  }

  ngOnDestroy() {
    this.resetForm();
  }

  onTransportStepSubmitted(transportData: Transport[]) {
    console.log('Transport data collected:', transportData);
    this.collectedData.transport = transportData;
  }

  onLogementStepSubmitted(logementData: Logement[]) {
    console.log('Logement data collected:', logementData);
    this.collectedData.logement = logementData;
  }

  onActivityStepSubmitted(activiteData: Activity[]) {
    this.collectedData.activite = activiteData;
  }

}
