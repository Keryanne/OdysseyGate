import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private flightApiUrl = 'http://localhost:5093/api/flights'; // URL pour les vols

  constructor(private http: HttpClient) {}

  getFlightsByCity(city: string): Observable<any> {
    return this.http.get(`${this.flightApiUrl}?city=${city}`);
  }

  getAvailableFlights(): Observable<any> {
    return this.http.get(`${this.flightApiUrl}/flights`); // Modifier l'URL si nécessaire
  }
}
