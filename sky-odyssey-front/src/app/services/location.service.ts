import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://localhost:5093/api/locations'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) {}

  getAllLocations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getLocationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createLocation(location: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', location.name);
    formData.append('description', location.description);
    formData.append('availableFrom', location.availableFrom);
    formData.append('availableTo', location.availableTo);
    formData.append('maxGuests', location.maxGuests);
    formData.append('includesTransport', location.includesTransport);
    formData.append('price', location.price);
    formData.append('city', location.city);
    if (location.image) {
      formData.append('image', location.image);
    }

    return this.http.post(this.apiUrl, formData);
  }

  searchLocations(params: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params.searchTerm) {
      httpParams = httpParams.append('searchTerm', params.searchTerm);
    }
    if (params.availableFrom) {
      httpParams = httpParams.append('availableFrom', params.availableFrom);
    }
    if (params.availableTo) {
      httpParams = httpParams.append('availableTo', params.availableTo);
    }
    if (params.maxPrice) {
      httpParams = httpParams.append('maxPrice', params.maxPrice);
    }
    if (params.maxGuests) {
      httpParams = httpParams.append('maxGuests', params.maxGuests);
    }

    return this.http.get(`${this.apiUrl}/search`, { params: httpParams });
  }
}
