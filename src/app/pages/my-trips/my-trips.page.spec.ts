import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTripsPage } from './my-trips.page';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { PixabayService } from 'src/app/services/pixabay.service';
import { trips } from './mock-trips';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MyTripsPage', () => {
  let component: MyTripsPage;
  let fixture: ComponentFixture<MyTripsPage>;
  let pixabayService: PixabayService;
  let router: Router;

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
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyTripsPage);
    component = fixture.componentInstance;
    pixabayService = TestBed.inject(PixabayService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the MyTripsPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should load images for each trip', () => {
    component.loadImages();
    trips.forEach(trip => {
      expect(pixabayService.getImages).toHaveBeenCalledWith(trip.city);
      expect(component.images[trip.city]).toBe('http://example.com/image.jpg');
    });
  });

  it('should navigate to trip details', () => {
    const trip = { id: 123, city: 'Paris' };
    component.openTripDetails(trip);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/trip-details', 123]);
  });

  it('should navigate to add-trip page', () => {
    component.addTrip();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/add-trip']);
  });
});
