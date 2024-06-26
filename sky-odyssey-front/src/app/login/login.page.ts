import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = "";
  password: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async login() {
    this.authService.login(this.email, this.password).subscribe(
      async (response) => {
        // Sauvegarder le token ou gérer la session ici
        localStorage.setItem('token', response.token);
        this.router.navigate(['/tabs/home']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Login Failed',
          message: 'Invalid email or password',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

}
