import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TransportFormComponent } from './transport-form.component';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Transport } from 'src/app/models/transport.model';

describe('TransportFormComponent', () => {
  let component: TransportFormComponent;
  let fixture: ComponentFixture<TransportFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TransportFormComponent, IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TransportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values by default', () => {
    expect(component.form.value).toEqual({
      transportType: '',
      transportNumber: '',
      transportCompagnie: '',
      transportStartDate: '',
      transportEndDate: '',
      transportDeparture: '',
      transportDestination: ''
    });
  });

  it('should initialize form with existingTransport values', () => {
    const transport: Transport = {
      type: 'Train',
      numero: 'TGV123',
      compagnie: 'SNCF',
      dateDepart: '2025-01-01T10:00:00Z',
      dateArrivee: '2025-01-01T12:00:00Z',
      depart: 'Paris',
      arrivee: 'Lyon'
    };
    component.existingTransport = transport;
    component.ngOnInit();
    expect(component.form.value).toEqual({
      transportType: 'Train',
      transportNumber: 'TGV123',
      transportCompagnie: 'SNCF',
      transportStartDate: '2025-01-01T10:00:00Z',
      transportEndDate: '2025-01-01T12:00:00Z',
      transportDeparture: 'Paris',
      transportDestination: 'Lyon'
    });
  });

  it('should patch transportStartDate on onTransportStartDateChange', () => {
    const event = { detail: { value: '2025-01-01T10:00:00Z' } };
    component.onTransportStartDateChange(event);
    expect(component.form.value.transportStartDate).toBe('2025-01-01T10:00:00Z');
    expect(component.transportStartDate).toBe('2025-01-01T10:00:00Z');
  });

  it('should patch transportEndDate on onTransportEndDateChange', () => {
    const event = { detail: { value: '2025-01-01T12:00:00Z' } };
    component.onTransportEndDateChange(event);
    expect(component.form.value.transportEndDate).toBe('2025-01-01T12:00:00Z');
    expect(component.transportEndDate).toBe('2025-01-01T12:00:00Z');
  });

  it('should emit formSubmitted on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.form.patchValue({
      transportType: 'Bus',
      transportNumber: 'B123',
      transportCompagnie: 'BusComp',
      transportStartDate: '2025-01-01T08:00:00Z',
      transportEndDate: '2025-01-01T10:00:00Z',
      transportDeparture: 'Nice',
      transportDestination: 'Marseille'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

 it('should not emit formSubmitted on submit if form is invalid', () => {
  jest.spyOn(component.formSubmitted, 'emit');
  component.form.get('transportType')?.setValidators([Validators.required]);
  component.form.get('transportType')?.updateValueAndValidity();
  component.form.patchValue({ transportType: '' });
  component.form.updateValueAndValidity();

  // Clear any emits from valueChanges
  (component.formSubmitted.emit as jest.Mock).mockClear();

  component.submit();
  expect(component.formSubmitted.emit).not.toHaveBeenCalled();
});

  it('should emit valueChanges in full mode when form is valid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();
    component.form.patchValue({
      transportType: 'Avion',
      transportNumber: 'AF123',
      transportCompagnie: 'Air France',
      transportStartDate: '2025-01-01T08:00:00Z',
      transportEndDate: '2025-01-01T10:00:00Z',
      transportDeparture: 'Paris',
      transportDestination: 'New York'
    });
    // Trigger valueChanges
    component.form.updateValueAndValidity();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value);
  });

  it('should not emit valueChanges in full mode when form is invalid', () => {
    component.mode = 'full';
    jest.spyOn(component.formSubmitted, 'emit');
    component.ngOnInit();

    component.form.get('transportType')?.setValidators([Validators.required]);
    component.form.get('transportType')?.updateValueAndValidity();
    component.form.patchValue({ transportType: '' });
    component.form.updateValueAndValidity();

    (component.formSubmitted.emit as jest.Mock).mockClear();

    component.form.patchValue({ transportType: '' });
    expect(component.formSubmitted.emit).not.toHaveBeenCalled();
  });

  it('should set showTransportStartDatePicker and showTransportEndDatePicker flags', () => {
    component.showTransportStartDatePicker = false;
    component.showTransportEndDatePicker = false;
    component.showTransportStartDatePicker = true;
    expect(component.showTransportStartDatePicker).toBe(true);
    component.showTransportEndDatePicker = true;
    expect(component.showTransportEndDatePicker).toBe(true);
  });
});
