import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitiesPage } from './cities.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PixabayService } from 'src/app/services/pixabay.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CitiesPage', () => {
  let component: CitiesPage;
  let fixture: ComponentFixture<CitiesPage>;
  let pixabayService: PixabayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitiesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'FR' // simulate ?code=FR
              }
            }
          }
        },
        {
          provide: PixabayService,
          useValue: {
            getImages: jest.fn().mockReturnValue(
              of({ hits: [{ webformatURL: 'http://image.test/city.jpg' }] })
            )
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesPage);
    component = fixture.componentInstance;
    pixabayService = TestBed.inject(PixabayService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cities from country code', () => {
    expect(component.countryCode).toBe('FR');
    expect(component.cities).toEqual(['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice']);
  });

  it('should call getImages for each city and assign them', () => {
    component.loadImages();
    component.cities.forEach(city => {
      expect(pixabayService.getImages).toHaveBeenCalledWith(city);
      expect(component.images[city]).toBe('http://image.test/city.jpg');
    });
  });

  it('should open search modal and set departure/destination cities', () => {
    component.openSearchModal({ departure: 'Lyon', destination: 'Paris' });
    expect(component.departureCity).toBe('Lyon');
    expect(component.destinationCity).toBe('Paris');
    expect(component.isModalOpen).toBe(true);
  });

  it('should close the modal', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });
});
