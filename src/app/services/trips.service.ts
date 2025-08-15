import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transport } from '../models/transport.model';
import { Logement } from '../models/logement.model';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVoyages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/voyages`);
  }

  getVoyageById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/voyages/${id}`);
  }

  createVoyage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/voyages`, data);
  }

  removeVoyage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/voyages/${id}`);
  }

  getTransportsByVoyage(voyageId: number): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/transport/by-voyage/${voyageId}`);
  }

  addTransport(voyageId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transport`, { voyageId, ...data });
  }

  removeTransport(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transport/${id}`);
  }

  updateTransport(id: number, data: any): Observable<any> {
    return this.http.patch<Transport>(`${this.apiUrl}/transport/${id}`, data);
  }

  getLogementsByVoyage(voyageId: number): Observable<Logement[]> {
    return this.http.get<Logement[]>(`${this.apiUrl}/logement/by-voyage/${voyageId}`);
  }

  addLogement(voyageId: number, data: any): Observable<Logement> {
    return this.http.post<Logement>(`${this.apiUrl}/logement`, { voyageId, ...data });
  }

  removeLogement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/logement/${id}`);
  }

  updateLogement(id: number, data: any): Observable<Logement> {
    return this.http.patch<Logement>(`${this.apiUrl}/logement/${id}`, data);
  }

  getActivitiesByVoyage(voyageId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activite/by-voyage/${voyageId}`);
  }

  addActivity(voyageId: number, data: any): Observable<Activity> {
    return this.http.post<Activity>(`${this.apiUrl}/activite`, { voyageId, ...data });
  }

  removeActivity(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/activite/${id}`);
  }

  updateActivity(id: number, data: any): Observable<Activity> {
    return this.http.patch<Activity>(`${this.apiUrl}/activite/${id}`, data);
  }

}
