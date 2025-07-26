import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripTransportListComponent } from './trip-transport-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { tripDetails } from 'src/app/pages/my-trip-details/trip-details.mock';

describe('TripTransportListComponent', () => {
  let component: TripTransportListComponent;
  let fixture: ComponentFixture<TripTransportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripTransportListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TripTransportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transports from tripDetails on init', () => {
    component.tripId = 1;
    component.ngOnInit();
    expect(component.transports).toEqual(tripDetails[1].transports);
  });

  it('should not assign transports if tripId is invalid', () => {
    component.tripId = 9999;
    component.ngOnInit();
    expect(component.transports).toEqual([]);
  });
});
