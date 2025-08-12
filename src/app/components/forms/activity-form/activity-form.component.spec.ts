import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivityFormComponent } from './activity-form.component';
import { Activity } from 'src/app/models/activity.model';

describe('ActivityFormComponent', () => {
  let component: ActivityFormComponent;
  let fixture: ComponentFixture<ActivityFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ActivityFormComponent, IonicModule.forRoot(), ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values by default', () => {
    expect(component.form.value).toEqual({
      activityName: '',
      activityLocation: ''
    });
  });

  it('should initialize form with existingActivity values', () => {
    const activity: Activity = {
      description: 'Visite guidée',
      lieu: 'Louvre',
      voyageId: ''
    };
    component.existingActivity = activity;
    component.ngOnInit();
    expect(component.form.value).toEqual({
      activityName: 'Visite guidée',
      activityLocation: 'Louvre'
    });
  });

  it('should emit formSubmitted on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.form.patchValue({
      activityName: 'Tour Eiffel',
      activityLocation: 'Paris'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('should not emit formSubmitted on submit if form is invalid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    // Make form invalid by adding required validator for this test
    component.form.get('activityName')?.setValidators([Validators.required]);
    component.form.get('activityName')?.updateValueAndValidity();
    component.form.patchValue({ activityName: '' });
    component.submit();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should emit valueChanges in full mode when form is valid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    component.form.patchValue({
      activityName: 'Musée',
      activityLocation: 'Lyon'
    });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('should not emit valueChanges in full mode when form is invalid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    // Make form invalid by adding required validator for this test
    component.form.get('activityName')?.setValidators([Validators.required]);
    component.form.get('activityName')?.updateValueAndValidity();
    component.form.patchValue({ activityName: '' });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should not emit valueChanges in single mode', () => {
    component.mode = 'single';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    component.form.patchValue({
      activityName: 'Randonnée',
      activityLocation: 'Montagne'
    });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });
});
