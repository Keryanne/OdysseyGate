import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-explore-details',
  templateUrl: 'explore-details.page.html',
  styleUrls: ['explore-details.page.scss']
})
export class ExploreDetailsPage implements OnInit {

  property: any;

  properties = [
    { id: 1, title: 'Property 1', type: 'Appartement', location: 'Montpellier', travelers: '4', bedroom: '2', beds: '2', bathroom: '1', host:'Karine Lemarchand', price: '12€', description: 'Description 1' },
    { id: 2, title: 'Property 2', description: 'Description 2' },
    // Ajoute plus de propriétés ici
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam;
      this.property = this.properties.find(p => p.id === id);
    } else {
      // Gérer le cas où l'ID est null
      console.error('ID de propriété non valide');
      // Vous pouvez rediriger l'utilisateur ou afficher un message d'erreur
    }
  }

}
