import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}
  user!: User;
  loading = true;
  errorMsg = '';

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.getUser().subscribe({
      next: (user: User) => {
        this.user = user;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMsg = "Impossible de charger le profil. Veuillez réessayer plus tard.";
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/tabs/login']);
  }

}
