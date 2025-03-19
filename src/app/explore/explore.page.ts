import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss']
})
export class ExplorePage implements OnInit {
  countries: any[] = [
    { id: 1, name: 'France' },
    { id: 2, name: 'Germany' },
    { id: 3, name: 'United States' },
    { id: 4, name: 'Canada' },
    { id: 5, name: 'Japan' },
    { id: 6, name: 'Australia' },
    { id: 7, name: 'Brazil' },
    { id: 8, name: 'India' },
    { id: 9, name: 'Mexico' },
    { id: 10, name: 'United Kingdom' }
  ];  

  ngOnInit() {

  }

  openDetails(id: number) {
    this.router.navigate(['/tabs/explore-details', id]);
  }

  constructor(private router: Router) {}

}
