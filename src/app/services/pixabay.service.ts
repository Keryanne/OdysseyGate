import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixabayService {
  private API_KEY = '23459976-ec7f6f525f2daeb3ba00da7ee';
  private API_URL = 'https://pixabay.com/api/';

  constructor(private http: HttpClient) {}

  getImages(query: string): Observable<any> {
    const url = `${this.API_URL}?key=${this.API_KEY}&q=${encodeURIComponent(query + ' travel landscape')}&category=travel&image_type=photo&orientation=horizontal&per_page=5`;
    return this.http.get<any>(url);
  }
}
