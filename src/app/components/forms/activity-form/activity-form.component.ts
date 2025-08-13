import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { Activity } from 'src/app/models/activity.model';

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule]
})
export class ActivityFormComponent implements OnInit {
  @Input() mode: 'full' | 'single' = 'full';
  @Input() existingActivities?: Activity[] = [];
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Activity[]>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

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
    this.activities.push(this.fb.group({
      description: [data?.description || ''],
      lieu: [data?.lieu || ''],
    }));
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  submit() {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value.activities);
    }
  }
}
