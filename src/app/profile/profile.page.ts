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

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/tabs/login']);
  }

}
