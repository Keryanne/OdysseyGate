import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { User } from '../models/user.model';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authService: AuthService;
  let router: Router;

  const mockUser: User = {
    id: 1,
    nom: 'Doe',
    prenom: 'John',
    email: 'john.doe@example.com'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getUser: jest.fn(),
            logout: jest.fn()
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create the ProfilePage component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile and set user/flags on success', () => {
    (authService.getUser as jest.Mock).mockReturnValue(of(mockUser));
    component.loadUserProfile();
    expect(component.loading).toBe(false);
    expect(component.user).toEqual(mockUser);
    expect(component.errorMsg).toBe('');
  });

  it('should set errorMsg and loading=false on user profile load error', () => {
    (authService.getUser as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
    component.loadUserProfile();
    expect(component.loading).toBe(false);
    expect(component.errorMsg).toBe("Impossible de charger le profil. Veuillez réessayer plus tard.");
  });

  it('should call logout and navigate to login on logout()', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/login']);
  });
});
