import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PixabayService } from 'src/app/services/pixabay.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.page.html',
  styleUrls: ['./cities.page.scss'],
})

export class CitiesPage implements OnInit {
  countryCode: string = '';
  cities: string[] = [];
  images: { [key: string]: string } = {};
  currentLocation = 'Chargement...';
  departureCity: string = 'Chargement...';
  destinationCity: string = '';
  isModalOpen: boolean = false; // Gère l'affichage de la "modale"

  countryCities: any = {
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

  constructor(private route: ActivatedRoute, private pixabayService: PixabayService,) {}

  ngOnInit() {
    this.countryCode = this.route.snapshot.paramMap.get('code')!;
    this.loadCities();
    this.loadImages();
  }

  loadCities() {
    this.cities = this.countryCities[this.countryCode] || [];
  }

  loadImages() {
    this.cities.forEach(city => {
      this.pixabayService.getImages(city).subscribe(response => {
        if (response.hits.length > 0) {
          this.images[city] = response.hits[0].webformatURL; // Prend la première image trouvée
        } else {
          this.images[city] = 'assets/no-image.png'; // Image par défaut
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
