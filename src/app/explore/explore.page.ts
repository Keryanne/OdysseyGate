import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PixabayService } from '../services/pixabay.service';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss']
})
export class ExplorePage implements OnInit {
  countries: any[] = [
    { id: 1, name: 'France', code: 'FR' },
    { id: 2, name: 'Germany', code: 'DE' },
    { id: 3, name: 'United States', code: 'US' },
    { id: 4, name: 'Canada', code: 'CA' },
    { id: 5, name: 'Japan', code: 'JP' },
    { id: 6, name: 'Australia', code: 'AU' },
    { id: 7, name: 'Brazil', code: 'BR' },
    { id: 8, name: 'India', code: 'IN' },
    { id: 9, name: 'Mexico', code: 'MX' },
    { id: 10, name: 'United Kingdom', code: 'GB' }
  ];

  cities: any = {
    'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'DE': ['Berlin', 'Hambourg', 'Munich', 'Cologne', 'Francfort'],
    'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
    'CA': ['Toronto', 'Vancouver', 'Montréal', 'Calgary', 'Ottawa'],
    'JP': ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nagoya'],
    'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adélaïde'],
    'BR': ['Rio de Janeiro', 'São Paulo', 'Brasilia', 'Salvador', 'Fortaleza'],
    'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
    'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla'],
    'GB': ['Londres', 'Manchester', 'Birmingham', 'Liverpool', 'Édimbourg']
  };

  images: { [key: string]: string } = {};
  isModalOpen: boolean = false;
  departureCity: string = 'Chargement...';
  destinationCity: string = '';

  openCities(country: any) {
    this.router.navigate(['/tabs/cities', country.code]);
  }

  constructor(private router: Router, private pixabayService: PixabayService) {}

  ngOnInit() {
    this.loadImages();
  }

  loadImages() {
    this.countries.forEach(country => {
      this.pixabayService.getImages(country.name).subscribe(response => {
        if (response.hits.length > 0) {
          this.images[country.name] = response.hits[0].webformatURL; // Prend la première image trouvée
        } else {
          this.images[country.name] = 'assets/no-image.png'; // Image par défaut
        }
      });
    });
  }

  openSearchModal(event?: { departure: string, destination: string }) {
    console.log('Départ:', event?.departure, 'Destination:', event?.destination);
    this.departureCity = event?.departure || '';
    this.destinationCity = event?.destination || '';
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false; // Ferme la modale
  }
}
