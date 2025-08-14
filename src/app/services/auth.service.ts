import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(name: string, surname: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { nom: name, prenom: surname, email, password, confirmPassword });
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
      } catch (error) {
        console.error('Error decoding token', error);
        return 0;
      }
    }
    return 0;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
    // return true
  }

  logout() {
    localStorage.removeItem('token');
  }

  getUserById(id: number): any {
    return this.http.get(`${this.apiUrl}/auth/user/${id}`);
  }

  getUser(): any {
    return this.http.get(`${this.apiUrl}/auth/me`);
  }
}
