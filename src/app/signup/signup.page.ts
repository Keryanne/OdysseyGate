import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = "";
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private alertController: AlertController
  ) {}

  async register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Inscription réussie',
          message: 'Ton compte a bien été créé !',
          buttons: ['OK']
        });
        await alert.present();
        this.navController.navigateRoot(['/tabs/login']);
      },
      error: async (error) => {
        const alert = await this.alertController.create({
          header: 'Inscription échouée',
          message: error?.error?.message || 'Une erreur est survenue',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
