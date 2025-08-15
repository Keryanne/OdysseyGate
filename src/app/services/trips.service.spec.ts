import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TripsService } from './trips.service';
import { environment } from '../../environments/environment';
import { Logement } from '../models/logement.model';
import { Activity } from '../models/activity.model';

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
    httpMock.verify();
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

  it('should GET voyage by id', () => {
    const mockResponse = { id: 2, destination: 'Tokyo' };
    service.getVoyageById(2).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/voyages/2`);
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

  it('should DELETE a voyage', () => {
    const voyageId = 4;
    const mockResponse = { success: true };

    service.removeVoyage(voyageId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/voyages/${voyageId}`);
    expect(req.request.method).toBe('DELETE');
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

  it('should DELETE a transport by id', () => {
    const transportId = 7;
    const mockResponse = { success: true };

    service.removeTransport(transportId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/transport/${transportId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should PATCH (update) a transport by id', () => {
    const transportId = 8;
    const updateData = { type: 'Bus', depart: 'Nice', arrivee: 'Cannes' };
    const mockResponse = { id: transportId, ...updateData };

    service.updateTransport(transportId, updateData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/transport/${transportId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  // Tests pour les logements
  it('should GET logements by voyageId', () => {
    const voyageId = 3;
    const mockLogements: Logement[] = [{
      id: 1, nom: 'Hôtel Paris', adresse: '10 Rue de Rivoli',
      voyageId: 0
    }];

    service.getLogementsByVoyage(voyageId).subscribe(res => {
      expect(res).toEqual(mockLogements);
    });

    const req = httpMock.expectOne(`${apiUrl}/logement/by-voyage/${voyageId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLogements);
  });

  it('should POST a logement with voyageId', () => {
    const voyageId = 5;
    const data = { nom: 'Airbnb Nice', adresse: '25 Boulevard des Anglais' };
    const mockResponse: Logement = { id: 10, voyageId, ...data };

    service.addLogement(voyageId, data).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/logement`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ voyageId, ...data });
    req.flush(mockResponse);
  });

  it('should DELETE a logement by id', () => {
    const logementId = 7;
    const mockResponse = { success: true };

    service.removeLogement(logementId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/logement/${logementId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should PATCH (update) a logement by id', () => {
    const logementId = 8;
    const updateData = { nom: 'Hôtel Premium', adresse: 'Nouvelle adresse' };
    const mockResponse: Logement = {
      id: logementId, ...updateData,
      voyageId: 0
    };

    service.updateLogement(logementId, updateData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/logement/${logementId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });

  // Tests pour les activités
  it('should GET activities by voyageId', () => {
    const voyageId = 3;
    const mockActivities: Activity[] = [{
      id: 1, description: 'Visite musée', lieu: 'Louvre',
      voyageId: voyageId
    }];

    service.getActivitiesByVoyage(voyageId).subscribe(res => {
      expect(res).toEqual(mockActivities);
    });

    const req = httpMock.expectOne(`${apiUrl}/activite/by-voyage/${voyageId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockActivities);
  });

  it('should POST an activity with voyageId', () => {
    const voyageId = 5;
    const data = { description: 'Plongée sous-marine', lieu: 'Côte d\'Azur' };
    const mockResponse: Activity = {
      id: 11, voyageId, ...data
    };

    service.addActivity(voyageId, data).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/activite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ voyageId, ...data });
    req.flush(mockResponse);
  });

  it('should DELETE an activity by id', () => {
    const activityId = 9;
    const mockResponse = { success: true };

    service.removeActivity(activityId).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/activite/${activityId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should PATCH (update) an activity by id', () => {
    const activityId = 12;
    const updateData = { description: 'Randonnée', lieu: 'Alpes' };
    const mockResponse: Activity = {
      id: activityId, ...updateData,
      voyageId: 0
    };

    service.updateActivity(activityId, updateData).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/activite/${activityId}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockResponse);
  });
});
