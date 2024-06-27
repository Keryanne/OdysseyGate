import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'L\'inscription a échoué',
        message: 'Les mots de passe ne correspondent pas',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.register(this.email, this.password, this.confirmPassword).subscribe(
      async (response) => {
        // Sauvegarder le token ou gérer la session ici
        localStorage.setItem('token', response.token);
        this.router.navigate(['/tabs/explore']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'L\'inscription a échoué',
          message: 'Réessayer plus tard',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}
