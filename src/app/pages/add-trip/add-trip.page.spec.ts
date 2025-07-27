import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTripPage } from './add-trip.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, NavController } from '@ionic/angular';
import { TripsService } from 'src/app/services/trips.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AddTripPage', () => {
  let component: AddTripPage;
  let fixture: ComponentFixture<AddTripPage>;
  let tripsServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    tripsServiceMock = {
      createVoyage: jest.fn().mockReturnValue(of({}))
    };

    routerMock = {
      navigate: jest.fn()
    };

    const navCtrlMock = {
      navigateForward: jest.fn(),
      navigateBack: jest.fn(),
      navigateRoot: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AddTripPage],
      imports: [ReactiveFormsModule, NoopAnimationsModule, FormsModule, IonicModule],
      providers: [
        { provide: TripsService, useValue: tripsServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: NavController, useValue: navCtrlMock }
      ],
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
      destination: 'Paris',
      departureCity: 'Lyon',
      startDate: '2025-08-01',
      endDate: '2025-08-10',
      people: 2
    });

    expect(component.isStep1Valid()).toBe(true);
  });

  it('should invalidate step 1 if fields are missing', () => {
    component.form.patchValue({
      destination: '',
      departureCity: '',
      startDate: '',
      endDate: '',
      people: ''
    });
    expect(component.isStep1Valid()).toBe(false);
  });

  it('should reset the form properly', () => {
    component.form.patchValue({ destination: 'Rome' });
    component.step = 3;

    component.resetForm();

    expect(component.step).toBe(1);
    expect(component.form.get('destination')?.value).toBeNull();
  });

  it('should reset form on ionViewWillEnter', () => {
    component.form.patchValue({ destination: 'Tokyo' });
    component.ionViewWillEnter();
    expect(component.form.get('destination')?.value).toBeNull();
  });

  it('should reset the form and step on ngOnDestroy', () => {
    component.form.patchValue({ destination: 'Trip' });
    component.step = 3;
    component.ngOnDestroy();
    expect(component.step).toBe(1);
    expect(component.form.get('destination')?.value).toBeNull();
  });

  it('should handle date changes and update the form accordingly', () => {
    const mockEvent = { detail: { value: '2025-08-01' } };

    component.onStartDateChange(mockEvent);
    expect(component.startDate).toBe('2025-08-01');
    expect(component.form.get('startDate')?.value).toBe('2025-08-01');

    component.onEndDateChange(mockEvent);
    expect(component.endDate).toBe('2025-08-01');
    expect(component.form.get('endDate')?.value).toBe('2025-08-01');

    component.onTransportStartDateChange(mockEvent);
    expect(component.transportStartDate).toBe('2025-08-01');

    component.onTransportEndDateChange(mockEvent);
    expect(component.transportEndDate).toBe('2025-08-01');

    // component.onHotelStartDateChange(mockEvent);
    // expect(component.hotelStartDate).toBe('2025-08-01');

    // component.onHotelEndDateChange(mockEvent);
    // expect(component.hotelEndDate).toBe('2025-08-01');

    // component.onActivityDateChange(mockEvent);
    // expect(component.activityDate).toBe('2025-08-01');
    // expect(component.form.get('activityDate')?.value).toBe('2025-08-01');
  });

  it('should call tripsService.createVoyage and navigate on valid submit', () => {
    component.form.patchValue({
      destination: 'Madrid',
      startDate: '2025-10-01',
      endDate: '2025-10-10',
      people: 2,
      departureCity: 'Valence',
      transportType: 'Train',
      transportNumber: 'TGV001',
      transportCompagnie: 'SNCF',
      transportStartDate: '2025-10-01',
      transportEndDate: '2025-10-10',
      transportDeparture: 'Valence',
      transportDestination: 'Madrid',
      hotelName: 'Ibis',
      hotelAdress: 'Rue centrale',
      activityName: 'Visite musée',
      activityLocation: 'Centre-ville'
    });

    component.submitForm();

    expect(tripsServiceMock.createVoyage).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'Madrid',
        dateDepart: '2025-10-01',
        dateArrivee: '2025-10-10',
        nombreVoyageurs: 2,
        villeDepart: 'Valence',
        transport: expect.objectContaining({
          type: 'Train',
          numero: 'TGV001',
          compagnie: 'SNCF',
          dateDepart: '2025-10-01',
          dateArrivee: '2025-10-10',
          depart: 'Valence',
          arrivee: 'Madrid' 
        }),
        logement: expect.objectContaining({
          nom: 'Ibis',
          adresse: 'Rue centrale'
        }),
        activite: expect.objectContaining({
          description: 'Visite musée',
          lieu: 'Centre-ville'
        })
      })
    );

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/my-trips']);
  });

  it('should not call tripsService.createVoyage if form is invalid', () => {
    component.form.patchValue({
      destination: '',
      departureCity: '',
      startDate: '',
      endDate: '',
      people: ''
    });

    component.submitForm();

    expect(tripsServiceMock.createVoyage).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
