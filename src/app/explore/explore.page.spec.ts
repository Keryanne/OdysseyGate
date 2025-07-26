import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExplorePage } from './explore.page';
import { Router } from '@angular/router';
import { PixabayService } from '../services/pixabay.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;
  let router: Router;
  let pixabayService: PixabayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExplorePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: PixabayService,
          useValue: {
            getImages: jest.fn().mockReturnValue(
              of({ hits: [{ webformatURL: 'http://image.test/country.jpg' }] })
            )
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    pixabayService = TestBed.inject(PixabayService);
    fixture.detectChanges();
  });

  it('should create the ExplorePage component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getImages for each country on init', () => {
    component.loadImages();
    component.countries.forEach(country => {
      expect(pixabayService.getImages).toHaveBeenCalledWith(country.name);
      expect(component.images[country.name]).toBe('http://image.test/country.jpg');
    });
  });

  it('should navigate to the cities page when openCities is called', () => {
    const country = { name: 'France', code: 'FR' };
    component.openCities(country);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/cities', 'FR']);
  });

  it('should open search modal and set departure/destination cities', () => {
    component.openSearchModal({ departure: 'Paris', destination: 'Tokyo' });
    expect(component.departureCity).toBe('Paris');
    expect(component.destinationCity).toBe('Tokyo');
    expect(component.isModalOpen).toBe(true);
  });

  it('should close the modal', () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });
});
