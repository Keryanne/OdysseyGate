import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
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
  @Input() existingLogements?: Logement[] = [];
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Logement[]>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      logements: this.fb.array([])
    });

    // pré-remplir avec un logement existant
    if (this.existingLogements && this.existingLogements.length > 0) {
      this.existingLogements.forEach(logement => this.addLogement(logement));
    } else {
      this.addLogement(); // Ajoute un bloc vide au départ
    }
  }

  get logements(): FormArray {
    return this.form.get('logements') as FormArray;
  }

  addLogement(data?: Partial<Logement>) {
    this.logements.push(this.fb.group({
      nom: [data?.nom || ''],
      adress: [data?.adress || ''],
    }));
  }

  removeLogement(index: number) {
    this.logements.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value.logements);
    }
  }
}
