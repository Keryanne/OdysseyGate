import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripTransportListComponent } from './trip-transport-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from 'src/app/services/trips.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TripTransportListComponent', () => {
  let component: TripTransportListComponent;
  let fixture: ComponentFixture<TripTransportListComponent>;
  let tripsService: TripsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripTransportListComponent],
      imports: [HttpClientTestingModule],
      providers: [TripsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TripTransportListComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transports from TripsService on init', () => {
    const mockTransports = [
      { 
        id: 1,
        type: 'Train',
        numero: 'TGV123',
        compagnie: 'SNCF',
        depart: 'Paris',
        arrivee: 'Lyon',
        dateDepart: new Date('2025-03-05T08:00:00Z'),
        dateArrivee: new Date('2025-03-05T11:30:00Z'),
      }
    ];

    component.tripId = 1;
    jest.spyOn(tripsService, 'getTransportsByVoyage').mockReturnValue(of(mockTransports));

    component.ngOnInit();

    expect(component.transports).toEqual(mockTransports);
  });

  it('should not assign transports if tripId is invalid', () => {
    component.tripId = 0;
    component.ngOnInit();
    expect(component.transports).toEqual([]);
  });
});
