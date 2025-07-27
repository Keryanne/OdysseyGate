import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTripsPage } from './my-trips.page';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PixabayService } from 'src/app/services/pixabay.service';
import { TripsService } from 'src/app/services/trips.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MyTripsPage', () => {
  let component: MyTripsPage;
  let fixture: ComponentFixture<MyTripsPage>;
  let pixabayService: jest.Mocked<PixabayService>;
  let tripsService: jest.Mocked<TripsService>;
  let router: Router;

  const mockTrips = [
    { id: 1, destination: 'Paris' },
    { id: 2, destination: 'Tokyo' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTripsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: PixabayService,
          useValue: {
            getImages: jest.fn().mockReturnValue(of({ hits: [{ webformatURL: 'http://example.com/image.jpg' }] }))
          }
        },
        {
          provide: TripsService,
          useValue: {
            getVoyages: jest.fn().mockReturnValue(of(mockTrips))
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyTripsPage);
    component = fixture.componentInstance;
    pixabayService = TestBed.inject(PixabayService) as jest.Mocked<PixabayService>;
    tripsService = TestBed.inject(TripsService) as jest.Mocked<TripsService>;
    router = TestBed.inject(Router);
  });

  it('should create the MyTripsPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should load trips and then images on ionViewWillEnter', () => {
    component.ionViewWillEnter(); // ⬅️ important !
    expect(tripsService.getVoyages).toHaveBeenCalled();
    expect(component.trips.length).toBe(2);
    expect(pixabayService.getImages).toHaveBeenCalledWith('Paris');
    expect(pixabayService.getImages).toHaveBeenCalledWith('Tokyo');
    expect(component.images['Paris']).toBe('http://example.com/image.jpg');
    expect(component.images['Tokyo']).toBe('http://example.com/image.jpg');
  });

  it('should navigate to trip details', () => {
    const trip = { id: 123, destination: 'Rome' };

    component.openTripDetails(trip);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/trip-details', 123]);
  });

  it('should navigate to add-trip page', () => {
    component.addTrip();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/add-trip']);
  });
});
