import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTripPage } from './add-trip.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, NavController } from '@ionic/angular';
import { TripsService } from 'src/app/services/trips.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

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
    component.prevStep();
    expect(component.step).toBe(1); // Should not go below 1
    component.step = 4;
    component.nextStep();
    expect(component.step).toBe(4); // Should not go above 4
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
    component.startDate = '2025-01-01';
    component.endDate = '2025-01-02';
    component.collectedData = {
      transport: { type: 'Train' },
      logement: { nom: 'Hotel' },
      activite: { description: 'Visite' }
    };

    component.resetForm();

    expect(component.step).toBe(1);
    expect(component.form.get('destination')?.value).toBeNull();
    expect(component.startDate).toBeNull();
    expect(component.endDate).toBeNull();
    expect(component.collectedData).toEqual({
      transport: [],
      logement: [],
      activite: []
    });
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
  });

  it('should collect transport data on onTransportStepSubmitted', () => {
    const transportData = [
      { type: 'Bus', numero: 'B123' },
      { type: 'Train', numero: 'TGV456' }
    ];
    component.onTransportStepSubmitted(transportData as any);
    expect(component.collectedData.transport).toEqual(transportData);
  });

  it('should collect logement data on onLogementStepSubmitted', () => {
    const logementData = [
      { nom: 'Hotel', adress: 'Rue' },
      { nom: 'Auberge', adress: 'Place' }
    ];
    component.onLogementStepSubmitted(logementData as any);
    expect(component.collectedData.logement).toEqual(logementData);
  });

  it('should collect activite data on onActivityStepSubmitted', () => {
    const activiteData = [
      { description: 'Visite', lieu: 'Paris' },
      { description: 'Randonnée', lieu: 'Alpes' }
    ];
    component.onActivityStepSubmitted(activiteData as any);
    expect(component.collectedData.activite).toEqual(activiteData);
  });

  it('should call tripsService.createVoyage and navigate on valid submit with arrays', () => {
    component.form.patchValue({
      destination: 'Madrid',
      startDate: '2025-10-01',
      endDate: '2025-10-10',
      people: 2,
      departureCity: 'Valence'
    });
    component.collectedData = {
      transport: [
        {
          type: 'Train',
          numero: 'TGV001',
          compagnie: 'SNCF',
          dateDepart: '2025-10-01',
          dateArrivee: '2025-10-10',
          depart: 'Valence',
          arrivee: 'Madrid'
        }
      ],
      logement: [
        {
          nom: 'Ibis',
          adress: 'Rue centrale'
        }
      ],
      activite: [
        {
          description: 'Visite musée',
          lieu: 'Centre-ville'
        }
      ]
    };

    component.submitForm();

    expect(tripsServiceMock.createVoyage).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: 'Madrid',
        dateDepart: '2025-10-01',
        dateArrivee: '2025-10-10',
        nombreVoyageurs: 2,
        villeDepart: 'Valence',
        transports: expect.arrayContaining([
          expect.objectContaining({
            type: 'Train',
            numero: 'TGV001',
            compagnie: 'SNCF',
            dateDepart: '2025-10-01',
            dateArrivee: '2025-10-10',
            depart: 'Valence',
            arrivee: 'Madrid'
          })
        ]),
        logements: expect.arrayContaining([
          expect.objectContaining({
            nom: 'Ibis',
            adress: 'Rue centrale'
          })
        ]),
        activites: expect.arrayContaining([
          expect.objectContaining({
            description: 'Visite musée',
            lieu: 'Centre-ville'
          })
        ])
      })
    );

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/my-trips']);
  });

  it('should handle error from tripsService.createVoyage', () => {
    tripsServiceMock.createVoyage.mockReturnValueOnce(throwError(() => new Error('fail')));
    component.form.patchValue({
      destination: 'Madrid',
      startDate: '2025-10-01',
      endDate: '2025-10-10',
      people: 2,
      departureCity: 'Valence'
    });
    component.collectedData = {
      transport: {},
      logement: {},
      activite: {}
    };
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.submitForm();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
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

  it('should build payload with empty collectedData arrays', () => {
    component.form.patchValue({
      destination: 'Nice',
      startDate: '2025-12-01',
      endDate: '2025-12-10',
      people: 1,
      departureCity: 'Marseille'
    });
    component.collectedData = {
      transport: [],
      logement: [],
      activite: []
    };
    component.submitForm();
    expect(tripsServiceMock.createVoyage).toHaveBeenCalledWith(
      expect.objectContaining({
        transports: [],
        logements: [],
        activites: []
      })
    );
  });
});
