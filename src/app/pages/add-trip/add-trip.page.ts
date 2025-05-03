import { Component, Injectable, ViewChild } from '@angular/core';
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
export class AddTripPage {

  step = 1;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      people: ['', Validators.min(1)],
      transportType: [''],
      transportDate: [''],
      duration: [''],
      file: ['']
    });
    
  }

  nextStep() {
    if (this.step < 4) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  showDatePicker = false;
  startDate: string | null = '';
  endDate: string | null = '';
  transportDate: string | null = '';

  openDatePicker() {
    this.showDatePicker = true;
  }

  showStartPicker = false;
  showEndPicker = false;
  showTransportDatePicker = false;

  onStartDateChange(event: any) {
    this.startDate = event.detail.value;
  }

  onEndDateChange(event: any) {
    this.endDate = event.detail.value;
  }

  onTransportDateChange(event: any) {
    this.transportDate = event.detail.value;
  }

  isCurrentStepValid(): boolean {
    switch (this.step) {
      case 1:
        return !!this.form.get('name')?.valid &&
               !!this.form.get('date')?.valid &&
               !!this.form.get('people')?.valid;
      case 2:
        return !!this.form.get('transportType')?.valid &&
               !!this.form.get('transportDate')?.valid &&
               !!this.form.get('duration')?.valid;
      // ajoute les autres étapes si besoin
      default:
        return true;
    }
  }
  
  isStep1Valid(): boolean {
    return !!this.form.get('name')?.valid &&
           !!this.form.get('date')?.valid &&
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
  

}
