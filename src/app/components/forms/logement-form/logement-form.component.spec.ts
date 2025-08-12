import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, Validators } from '@angular/forms';

import { LogementFormComponent } from './logement-form.component';
import { Logement } from 'src/app/models/logement.model';

describe('LogementFormComponent', () => {
  let component: LogementFormComponent;
  let fixture: ComponentFixture<LogementFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LogementFormComponent, IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LogementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values by default', () => {
    expect(component.form.value).toEqual({
      hotelName: '',
      hotelAdress: ''
    });
  });

  it('should initialize form with existingLogement values', () => {
    const logement: Logement = {
      nom: 'Hotel Test',
      adress: '123 rue Test',
      voyageId: ''
    };
    component.existingLogement = logement;
    component.ngOnInit();
    expect(component.form.value).toEqual({
      hotelName: 'Hotel Test',
      hotelAdress: '123 rue Test'
    });
  });

  it('should emit formSubmitted on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.form.patchValue({
      hotelName: 'Hotel ABC',
      hotelAdress: '1 rue de Paris'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('should not emit formSubmitted on submit if form is invalid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    // Make form invalid by adding required validator for this test
    component.form.get('hotelName')?.setValidators([Validators.required]);
    component.form.get('hotelName')?.updateValueAndValidity();
    component.form.patchValue({ hotelName: '' });
    component.submit();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should emit valueChanges in full mode when form is valid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    component.form.patchValue({
      hotelName: 'Hotel DEF',
      hotelAdress: '2 rue DEF'
    });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('should not emit valueChanges in full mode when form is invalid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    // Make form invalid by adding required validator for this test
    component.form.get('hotelName')?.setValidators([Validators.required]);
    component.form.get('hotelName')?.updateValueAndValidity();
    component.form.patchValue({ hotelName: '' });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should not emit valueChanges in single mode', () => {
    component.mode = 'single';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    component.form.patchValue({
      hotelName: 'Hotel Single',
      hotelAdress: '3 rue Single'
    });
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });
});
