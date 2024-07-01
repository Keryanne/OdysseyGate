import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5093/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { email, password });
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, { username, email, password });
  }

  getReservations(): Observable<any[]> {
    if (this.isLoggedIn()) {
      console.log('User is logged in, returning reservations.'); // Debugging line
      // Simuler des réservations pour l'utilisateur connecté
      return of([
        { id: 1, title: 'Reservation 1', date: '2024-06-20T10:00:00', price: "360" },
        { id: 2, title: 'Reservation 2', date: '2024-07-15T10:00:00', price: "250" }
      ]).pipe(delay(1000));
    } else {
      console.log('User is not logged in, returning empty array.'); // Debugging line
      return of([]).pipe(delay(1000));
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
    // return true
  }

  logout() {
    localStorage.removeItem('token');
  }
}
