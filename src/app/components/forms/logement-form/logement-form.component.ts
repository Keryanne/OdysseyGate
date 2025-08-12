import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { Logement } from 'src/app/models/logement.model';

@Component({
  selector: 'app-logement-form',
  templateUrl: './logement-form.component.html',
  styleUrls: ['./logement-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class LogementFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingLogement?: Logement;
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Logement>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      hotelName: [this.existingLogement?.nom || ''],
      hotelAdress: [this.existingLogement?.adress || ''],
    });

    if (this.mode === 'full') {
      this.form.valueChanges.subscribe((value: Logement) => {
        if (this.form.valid) {
          this.formSubmitted.emit(value);
        }
      });
    }
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }
}
