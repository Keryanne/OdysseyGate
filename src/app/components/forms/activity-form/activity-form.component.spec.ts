import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

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

  it('should initialize form with one empty activity by default', () => {
    expect(component.activities.length).toBe(1);
    expect(component.form.value).toEqual({
      activities: [{
        description: '',
        lieu: ''
      }]
    });
  });

  it('should initialize form with existingActivities values', () => {
    const activities: Activity[] = [
      { description: 'Visite guidée', lieu: 'Louvre', voyageId: '' },
      { description: 'Randonnée', lieu: 'Alpes', voyageId: '' }
    ];
    component.existingActivities = activities;
    component.ngOnInit();
    expect(component.activities.length).toBe(2);
    expect(component.form.value.activities[0]).toEqual({
      description: 'Visite guidée',
      lieu: 'Louvre'
    });
    expect(component.form.value.activities[1]).toEqual({
      description: 'Randonnée',
      lieu: 'Alpes'
    });
  });

  it('should add a new activity block when addActivity is called', () => {
    const initialLength = component.activities.length;
    component.addActivity();
    expect(component.activities.length).toBe(initialLength + 1);
  });

  it('should remove an activity block when removeActivity is called', () => {
    component.addActivity();
    const initialLength = component.activities.length;
    component.removeActivity(0);
    expect(component.activities.length).toBe(initialLength - 1);
  });

  it('should emit formSubmitted with all activities on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.activities.at(0).patchValue({
      description: 'Tour Eiffel',
      lieu: 'Paris'
    });
    component.addActivity({
      description: 'Musée',
      lieu: 'Lyon'
    });
    component.activities.at(1).patchValue({
      description: 'Musée',
      lieu: 'Lyon'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value.activities);
    expect(component.form.value.activities.length).toBe(2);
  });
});
