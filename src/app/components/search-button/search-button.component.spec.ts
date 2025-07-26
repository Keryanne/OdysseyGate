import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchButtonComponent } from './search-button.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Geolocation } from '@capacitor/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

jest.mock('@capacitor/geolocation', () => ({
  Geolocation: {
    getCurrentPosition: jest.fn()
  }
}));

describe('SearchButtonComponent', () => {
  let component: SearchButtonComponent;
  let fixture: ComponentFixture<SearchButtonComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchButtonComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchButtonComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // ne pas déclencher ngOnInit automatiquement
  });

  afterEach(() => {
    httpMock.verify(); // vérifie que toutes les requêtes ont été gérées
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call reverseGeocode with latitude and longitude', async () => {
    (Geolocation.getCurrentPosition as jest.Mock).mockResolvedValue({
      coords: { latitude: 48.8566, longitude: 2.3522 },
      timestamp: Date.now()
    });

    const spy = jest.spyOn(component, 'reverseGeocode');
    await component.getCurrentLocation();

    expect(spy).toHaveBeenCalledWith(48.8566, 2.3522);

    const req = httpMock.expectOne((req) =>
      req.url.includes('nominatim.openstreetmap.org/reverse')
    );
    req.flush({ address: { city: 'Paris' } });
  });

  it('should set departureCity from reverseGeocode API', () => {
    component.reverseGeocode(48.8566, 2.3522);

    const req = httpMock.expectOne((req) =>
      req.url.includes('nominatim.openstreetmap.org/reverse')
    );
    expect(req.request.method).toBe('GET');

    req.flush({ address: { city: 'Paris' } });
    expect(component.departureCity).toBe('Paris');
  });

  it('should emit openSearch event on button click', () => {
    component.departureCity = 'Paris';
    component.destinationCity = 'Tokyo';

    const emitSpy = jest.spyOn(component.openSearch, 'emit');

    component.onSearchClick();

    expect(emitSpy).toHaveBeenCalledWith({
      departure: 'Paris',
      destination: 'Tokyo'
    });
  });
});
