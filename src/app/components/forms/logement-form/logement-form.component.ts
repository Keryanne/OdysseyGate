import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from "@ionic/angular";
import { Logement } from 'src/app/models/logement.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logement-form',
  templateUrl: './logement-form.component.html',
  styleUrls: ['./logement-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class LogementFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingLogements?: Logement[] = [];
  @Input() tripId?: number;
  @Input() isUpdate?: boolean = false;

  @Output() formSubmitted = new EventEmitter<Logement[]>(); // Assure-toi que cette ligne est présente

  form!: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController) {}

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
    const groupConfig: any = {
      nom: [data?.nom || ''],
      adresse: [data?.adresse || '']
    };

    // Ajoute l'id uniquement en mode update et si présent
    if (this.isUpdate && data?.id !== undefined) {
      groupConfig.id = [data.id];
    }

    this.logements.push(this.fb.group(groupConfig));
  }

  removeLogement(index: number) {
    this.logements.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      if (this.mode === 'full') {
        // Émet l'événement pour le mode 'full'
        this.formSubmitted.emit(this.form.value.logements);
      } else if (this.mode === 'single') {
        if (this.isUpdate) {
          this.modalController.dismiss({ update: true, logements: this.form.value.logements });
        } else {
          this.modalController.dismiss({ update: false, logements: this.form.value.logements });
        }
      }
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
