import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTripPage } from './add-trip.page';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule  } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';

describe('AddTripPage', () => {
  let component: AddTripPage;
  let fixture: ComponentFixture<AddTripPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTripPage],
      imports: [ReactiveFormsModule, NoopAnimationsModule, FormsModule, IonicModule ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTripPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AddTripPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should go to next and previous steps', () => {
    expect(component.step).toBe(1);

    component.nextStep();
    expect(component.step).toBe(2);

    component.prevStep();
    expect(component.step).toBe(1);
  });

  it('should validate step 1 only with required fields filled', () => {
    component.form.patchValue({
      name: 'Test Trip',
      startDate: '2025-08-01',
      endDate: '2025-08-10',
      people: 2
    });

    expect(component.isStep1Valid()).toBe(true);
  });

  it('should invalidate step 1 if fields are missing', () => {
    component.form.patchValue({
      name: '',
      startDate: '',
      endDate: '',
      people: ''
    });

    expect(component.isStep1Valid()).toBe(false);
  });

  it('should reset the form and step on ngOnDestroy', () => {
    component.form.patchValue({ name: 'Trip' });
    component.step = 3;

    component.ngOnDestroy();

    expect(component.step).toBe(1);
    expect(component.form.get('name')?.value).toBeNull();
  });

  it('should log a message when submitting a valid form', () => {
    const logSpy = jest.spyOn(console, 'log');

    component.form.patchValue({
      name: 'Test Trip',
      startDate: '2025-08-01',
      endDate: '2025-08-10',
      people: 3
    });

    component.submitForm();
    expect(logSpy).toHaveBeenCalledWith(
      'Formulaire valide et prêt à être envoyé :',
      expect.objectContaining({
        name: 'Test Trip',
        startDate: '2025-08-01',
        endDate: '2025-08-10',
        people: 3
      })
    );
  });
});
