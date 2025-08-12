import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Transport } from 'src/app/models/transport.model';
import { IonicModule } from "@ionic/angular";
import { DatePipe } from '@angular/common';
import { TripsService } from 'src/app/services/trips.service';

@Component({
  selector: 'app-transport-form',
  templateUrl: './transport-form.component.html',
  styleUrls: ['./transport-form.component.scss'],
  standalone: true,
  imports: [IonicModule, DatePipe, ReactiveFormsModule]
})
export class TransportFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingTransport?: Transport;
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Transport>();

  form!: FormGroup;
  transportStartDate?: string;
  transportEndDate?: string;

  showTransportStartDatePicker = false;
  showTransportEndDatePicker = false;

  constructor(private fb: FormBuilder, private tripsService: TripsService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      transportType: [this.existingTransport?.type || ''],
      transportNumber: [this.existingTransport?.numero || ''],
      transportCompagnie: [this.existingTransport?.compagnie || ''],
      transportStartDate: [this.existingTransport?.dateDepart || ''],
      transportEndDate: [this.existingTransport?.dateArrivee || ''],
      transportDeparture: [this.existingTransport?.depart || ''],
      transportDestination: [this.existingTransport?.arrivee || ''],
    });

    this.transportStartDate = this.form.value.transportStartDate;
    this.transportEndDate = this.form.value.transportEndDate;

     if (this.mode === 'full') {
      this.form.valueChanges.subscribe((value: Transport) => {
        if (this.form.valid) {
          this.formSubmitted.emit(value);
        }
    });
  }
  }

  onTransportStartDateChange(event: any) {
    this.transportStartDate = event.detail.value;
    this.form.patchValue({ transportStartDate: this.transportStartDate });
  }

   onTransportEndDateChange(event: any) {
    this.transportEndDate = event.detail.value;
    this.form.patchValue({ transportEndDate: this.transportEndDate });
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);

      if (this.mode === 'single') {
        // this.tripsService.addTransportToVoyage(this.tripId, this.form.value).subscribe(...)
      }
    }
  }
}
