import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Transport } from 'src/app/models/transport.model';
import { IonicModule, ModalController } from "@ionic/angular";
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
  @Input() isUpdate?: boolean = false;
  @Input() tripStartDate: string | null = null;
  @Input() tripEndDate: string | null = null;

  @Output() formSubmitted = new EventEmitter<Transport[]>();

  form!: FormGroup;

  showTransportStartDatePicker: number | null = null;
  showTransportEndDatePicker: number | null = null;

  constructor(private fb: FormBuilder, private modalController: ModalController) {}

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
    const groupConfig: any = {
      type: [data?.type || ''],
      numero: [data?.numero || ''],
      compagnie: [data?.compagnie || ''],
      dateDepart: [data?.dateDepart || null],
      dateArrivee: [data?.dateArrivee || null],
      depart: [data?.depart || ''],
      arrivee: [data?.arrivee || ''],
    };

    // Ajoute l'id uniquement en mode update et si présent
    if (this.isUpdate && data?.id !== undefined) {
      groupConfig.id = [data.id];
    }

    this.transports.push(this.fb.group(groupConfig));
  }

  removeTransport(index: number) {
    this.transports.removeAt(index);
  }

  onTransportStartDateChange(event: any, index: number) {
    const value = event.detail.value;
    this.transports.at(index).patchValue({
      dateDepart: value ? new Date(value) : null
    });
  }

  onTransportEndDateChange(event: any, index: number) {
    const value = event.detail.value;
    this.transports.at(index).patchValue({
      dateArrivee: value ? new Date(value) : null
    });
  }

  submit() {
    if (this.form.valid && this.mode === 'full' && !this.isUpdate) {
      this.formSubmitted.emit(this.form.value.transports);
    }
    if (this.form.valid && this.mode === 'single') {
      if (this.isUpdate) {
        // Envoie le transport à mettre à jour (avec id)
        console.log('Mise à jour du transport :', this.form.value.transports);
        this.modalController.dismiss({ update: true, transports: this.form.value.transports });
      } else {
        this.modalController.dismiss({ update: false, transports: this.form.value.transports });
      }
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
