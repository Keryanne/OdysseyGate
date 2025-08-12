import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  goToAddTrip() {
    this.router.navigate(['/tabs/add-trip']);
  }

  goToMyTrips() {
    this.router.navigate(['/tabs/my-trips']);
  }

  goToRegister() {
    this.router.navigate(['/tabs/register']);
  }

  goToLogin() {
    this.router.navigate(['/tabs/login']);
  }
}
