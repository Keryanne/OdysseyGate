import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  @Input() existingActivity?: Activity;
  @Input() tripId?: number;

  @Output() formSubmitted = new EventEmitter<Activity>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      activityName: [this.existingActivity?.description || ''],
      activityLocation: [this.existingActivity?.lieu || ''],
    });

    if (this.mode === 'full') {
      this.form.valueChanges.subscribe((value: Activity) => {
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
