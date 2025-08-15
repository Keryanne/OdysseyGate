import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PwaInstallService } from 'src/app/services/pwa-install.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {

  constructor(
    private authService: AuthService,
    private router: Router,
    private pwaInstallService: PwaInstallService
  ) { 
    this.pwaInstallService.installPrompt.subscribe(prompt => {
      this.canInstall = !!prompt;
    });
  }

  canInstall = false;

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  goToAddTrip() {
    this.router.navigate(['/add-trip']);
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

  installApp() {
    this.pwaInstallService.showInstallPrompt();
  }
}
