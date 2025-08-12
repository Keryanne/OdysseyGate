import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TripsService } from './trips.service';
import { environment } from '../../environments/environment';

describe('TripsService', () => {
  let service: TripsService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripsService],
    });
    service = TestBed.inject(TripsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // vérifie qu'il n'y a pas de requêtes en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET all voyages', () => {
    const mockResponse = [{ id: 1, destination: 'Paris' }];

    service.getVoyages().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/voyages`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should POST a new voyage', () => {
    const newVoyage = { destination: 'Tokyo', dateDepart: '2025-08-01' };
    const mockResponse = { id: 2, ...newVoyage };

    service.createVoyage(newVoyage).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/voyages`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newVoyage);

    req.flush(mockResponse);
  });

  it('should GET transports by voyageId', () => {
    const voyageId = 3;
    const mockTransports = [{ id: 1, type: 'Avion' }];

    service.getTransportsByVoyage(voyageId).subscribe(res => {
      expect(res).toEqual(mockTransports);
    });

    const req = httpMock.expectOne(`${apiUrl}/transport/by-voyage/${voyageId}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTransports);
  });

  it('should POST a transport with voyageId', () => {
    const voyageId = 5;
    const data = { type: 'Train', depart: 'Lyon', arrivee: 'Paris' };
    const mockResponse = { id: 10, ...data };

    service.addTransport(voyageId, data).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/transport`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ voyageId, ...data });

    req.flush(mockResponse);
  });
});
