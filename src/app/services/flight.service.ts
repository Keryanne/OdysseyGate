import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private flightApiUrl = `${environment.apiUrl}/flights`;

  constructor(private http: HttpClient) {}

  getFlightsByCity(propertyId: number): Observable<any> {
    return this.http.get(`${this.flightApiUrl}/by-location/${propertyId}`);
  }

  getAvailableFlights(): Observable<any> {
    return this.http.get(`${this.flightApiUrl}`); 
  }
}
