import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-button',
  templateUrl: './search-button.component.html',
  styleUrls: ['./search-button.component.scss'],
})
export class SearchButtonComponent implements OnInit {
  @Input() destinationCity: string = '';
  @Input() icon: string = 'search'; // Icône personnalisable

  @Output() openSearch = new EventEmitter<{ departure: string, destination: string }>();

  departureCity: string = 'Chargement...';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getCurrentLocation();
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Position:', position);

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.reverseGeocode(latitude, longitude);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      this.departureCity = 'Localisation indisponible';
    }
  }

  reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    this.http.get<any>(url).subscribe(response => {
      console.log('Réponse API:', response);

      if (response?.address?.city) {
        this.departureCity = response.address.city;
      } else if (response?.address?.town) {
        this.departureCity = response.address.town;
      } else if (response?.address?.village) {
        this.departureCity = response.address.village;
      } else {
        this.departureCity = 'Localisation inconnue';
      }
    }, error => {
      console.error('Erreur API:', error);
      this.departureCity = 'Localisation indisponible';
    });
  }

  onSearchClick() {
    this.openSearch.emit({
      departure: this.departureCity,
      destination: this.destinationCity
    });
  }
}
