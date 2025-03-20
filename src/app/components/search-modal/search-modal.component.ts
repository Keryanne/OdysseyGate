import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.scss'],
})
export class SearchModalComponent implements OnInit, AfterViewInit {
  @Input() departureCity: string = ''; // Ville de départ par défaut
  @Input() destinationCity: string = ''; // Ville de destination (optionnelle)
  @Output() close = new EventEmitter<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    console.log("Départ:", this.departureCity);
    console.log("Destination:", this.destinationCity);
  }

  ngAfterViewInit() {
    // Ajoute la classe active après un petit délai pour déclencher l'animation
    setTimeout(() => {
      this.renderer.addClass(this.el.nativeElement.querySelector('.modal-overlay'), 'active');
    }, 10);
  }

  closeModal() {
    // Supprime la classe active pour la fermeture en douceur
    this.renderer.removeClass(this.el.nativeElement.querySelector('.modal-overlay'), 'active');

    // Attend la fin de l'animation avant de fermer la modale
    setTimeout(() => {
      this.close.emit();
    }, 300); // Durée de l'animation CSS
  }

  search() {
    console.log('Recherche de trajet de', this.departureCity, 'à', this.destinationCity);
    this.closeModal();
  }
}
