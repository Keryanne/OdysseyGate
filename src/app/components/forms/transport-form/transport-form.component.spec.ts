import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TransportFormComponent } from './transport-form.component';
import { ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
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

  it('should initialize form with one empty transport by default', () => {
    expect(component.transports.length).toBe(1);
    expect(component.form.value).toEqual({
      transports: [{
        type: '',
        numero: '',
        compagnie: '',
        dateDepart: null,
        dateArrivee: null,
        depart: '',
        arrivee: ''
      }]
    });
  });

  it('should initialize form with existingTransports values', () => {
    const transports: Transport[] = [
      {
        type: 'Train',
        numero: 'TGV123',
        compagnie: 'SNCF',
        dateDepart: new Date('2025-01-01T10:00:00Z'),
        dateArrivee: new Date('2025-01-01T12:00:00Z'),
        depart: 'Paris',
        arrivee: 'Lyon'
      },
      {
        type: 'Bus',
        numero: 'B456',
        compagnie: 'BusComp',
        dateDepart: new Date('2025-01-02T08:00:00Z'),
        dateArrivee: new Date('2025-01-02T10:00:00Z'),
        depart: 'Nice',
        arrivee: 'Marseille'
      }
    ];
    component.existingTransports = transports;
    component.ngOnInit();
    expect(component.transports.length).toBe(2);
    expect(component.form.value.transports[0]).toEqual(transports[0]);
    expect(component.form.value.transports[1]).toEqual(transports[1]);
  });

  it('should add a new transport block when addTransport is called', () => {
    const initialLength = component.transports.length;
    component.addTransport();
    expect(component.transports.length).toBe(initialLength + 1);
  });

  it('should remove a transport block when removeTransport is called', () => {
    component.addTransport();
    const initialLength = component.transports.length;
    component.removeTransport(0);
    expect(component.transports.length).toBe(initialLength - 1);
  });

  it('should patch dateDepart on onTransportStartDateChange', () => {
    const event = { detail: { value: '2025-01-01T10:00:00Z' } };
    component.onTransportStartDateChange(event, 0);
    expect(component.transports.at(0).value.dateDepart).toEqual(new Date('2025-01-01T10:00:00Z'));
  });

  it('should patch dateArrivee on onTransportEndDateChange', () => {
    const event = { detail: { value: '2025-01-01T12:00:00Z' } };
    component.onTransportEndDateChange(event, 0);
    expect(component.transports.at(0).value.dateArrivee).toEqual(new Date('2025-01-01T12:00:00Z'));
  });

  it('should emit formSubmitted with all transports on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.transports.at(0).patchValue({
      type: 'Bus',
      numero: 'B123',
      compagnie: 'BusComp',
      dateDepart: new Date('2025-01-01T08:00:00Z'),
      dateArrivee: new Date('2025-01-01T10:00:00Z'),
      depart: 'Nice',
      arrivee: 'Marseille'
    });
    component.addTransport({
      type: 'Train',
      numero: 'TGV456',
      compagnie: 'SNCF',
      dateDepart: new Date('2025-01-02T10:00:00Z'),
      dateArrivee: new Date('2025-01-02T12:00:00Z'),
      depart: 'Lyon',
      arrivee: 'Paris'
    });
    component.transports.at(1).patchValue({
      type: 'Train',
      numero: 'TGV456',
      compagnie: 'SNCF',
      dateDepart: new Date('2025-01-02T10:00:00Z'),
      dateArrivee: new Date('2025-01-02T12:00:00Z'),
      depart: 'Lyon',
      arrivee: 'Paris'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value.transports);
    expect(component.form.value.transports.length).toBe(2);
  });

  it('should set showTransportStartDatePicker and showTransportEndDatePicker flags', () => {
    component.showTransportStartDatePicker = null;
    component.showTransportEndDatePicker = null;
    component.showTransportStartDatePicker = 0;
    expect(component.showTransportStartDatePicker).toBe(0);
    component.showTransportEndDatePicker = 1;
    expect(component.showTransportEndDatePicker).toBe(1);
  });
});
