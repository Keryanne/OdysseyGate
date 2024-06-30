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
  username: string = "";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async register() {
    console.log('Password', this.password, 'Confirm Password', this.confirmPassword)
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'L\'inscription a échoué',
        message: 'Les mots de passe ne correspondent pas',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    this.authService.register(this.username, this.email, this.password, this.confirmPassword).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Registration successful!',
          buttons: ['OK']
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'L\'inscription a échoué',
          message: error.error.message || 'An error occurred during registration. Please try again.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }
}
