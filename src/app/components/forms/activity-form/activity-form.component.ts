import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from "@ionic/angular";
import { Activity } from 'src/app/models/activity.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule]
})
export class ActivityFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingActivities?: Activity[] = [];
  @Input() tripId?: number;
  @Input() isUpdate?: boolean = false;

  @Output() formSubmitted = new EventEmitter<Activity[]>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private modalController: ModalController) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      activities: this.fb.array([])
    });

    // pré-remplir avec une activité existante
    if (this.existingActivities && this.existingActivities.length > 0) {
      this.existingActivities.forEach(activity => this.addActivity(activity));
    } else {
      this.addActivity(); // Ajoute un bloc vide au départ
    }
  }

  get activities(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  addActivity(data?: Partial<Activity>) {
    const groupConfig: any = {
      description: [data?.description || ''],
      lieu: [data?.lieu || '']
    };

    // Ajoute l'id uniquement en mode update et si présent
    if (this.isUpdate && data?.id !== undefined) {
      groupConfig.id = [data.id];
    }

    this.activities.push(this.fb.group(groupConfig));
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      if (this.mode === 'full') {
        // Émet l'événement pour le mode 'full'
        this.formSubmitted.emit(this.form.value.activities);
      } else if (this.mode === 'single') {
        if (this.isUpdate) {
          this.modalController.dismiss({ update: true, activities: this.form.value.activities });
        } else {
          this.modalController.dismiss({ update: false, activities: this.form.value.activities });
        }
      }
    }
  }

  cancel() {
    this.modalController.dismiss();
  }
}
