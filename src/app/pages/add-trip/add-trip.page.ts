import { Component, Injectable, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime } from '@ionic/angular';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

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
  

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      people: ['', Validators.min(1)],

      transportType: [''],
      transportDate: [''],
      duration: [''],
      transportFile: [''],

      hotelName: [''],
      hotelStartDate: [''],
      hotelEndDate: [''],
      hotelFile: [''],

      activityName: [''],
      activityDate: [''],
      activityLocation: [''],
      activityFile: [''],
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
  transportDate: string | null = '';
  activityDate: string | null = '';

  showStartPicker = false;
  showEndPicker = false;
  showTransportDatePicker = false;
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

  onTransportDateChange(event: any) {
    this.transportDate = event.detail.value;
    this.form.patchValue({ transportDate: this.transportDate });
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
    return !!this.form.get('name')?.valid &&
           !!this.form.get('startDate')?.valid &&
           !!this.form.get('endDate')?.valid &&
           !!this.form.get('people')?.valid;
  }
  
  submitForm() {
    if (this.isStep1Valid()) {
      console.log('Formulaire valide et prêt à être envoyé :', this.form.value);
      // Tu peux appeler ici ton service d’envoi ou naviguer
    } else {
      console.log('Champs obligatoires manquants');
    }
  }
  
  resetForm() {
    this.form.reset();
    this.step = 1;
    this.startDate = null;
    this.endDate = null;
    this.transportDate = null;
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
