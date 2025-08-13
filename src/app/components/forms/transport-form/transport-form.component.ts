import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Transport } from 'src/app/models/transport.model';
import { IonicModule } from "@ionic/angular";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
  standalone: true,
  imports: [IonicModule, DatePipe, ReactiveFormsModule]
})
export class TransportFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingTransports?: Transport[] = [];
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Transport[]>();

  form!: FormGroup;

  showTransportStartDatePicker: number | null = null;
  showTransportEndDatePicker: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transports: this.fb.array([])
    });

    // pré-remplir avec un transport existant
    if (this.existingTransports && this.existingTransports.length > 0) {
      this.existingTransports.forEach(t => this.addTransport(t));
    } else {
      this.addTransport();
    }
  }

  get transports(): FormArray {
    return this.form.get('transports') as FormArray;
  }

  addTransport(data?: Partial<Transport>) {
    this.transports.push(this.fb.group({
      type: [data?.type || ''],
      numero: [data?.numero || ''],
      compagnie: [data?.compagnie || ''],
      dateDepart: [data?.dateDepart || ''],
      dateArrivee: [data?.dateArrivee || ''],
      depart: [data?.depart || ''],
      arrivee: [data?.arrivee || ''],
    }));
  }

  removeTransport(index: number) {
    this.transports.removeAt(index);
  }

  onTransportStartDateChange(event: any, index: number) {
    this.transports.at(index).patchValue({ dateDepart: event.detail.value });
  }

  onTransportEndDateChange(event: any, index: number) {
    this.transports.at(index).patchValue({ dateArrivee: event.detail.value });
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value.transports);
    }
  }
}
