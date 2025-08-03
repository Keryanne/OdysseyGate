import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transport } from '../models/transport.model';

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

  getTransportsByVoyage(voyageId: number): Observable<Transport[]> {
    return this.http.get<Transport[]>(`${this.apiUrl}/transport?voyageId=${voyageId}`);
  }

  addTransport(voyageId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transport`, { voyageId, ...data });
  }
}

