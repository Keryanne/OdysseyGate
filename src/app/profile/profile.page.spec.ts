import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile.page';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: {
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
    fixture.detectChanges();
  });

  it('should create the ProfilePage component', () => {
    expect(component).toBeTruthy();
  });

  it('should set userEmail on ngOnInit', () => {
    component.ngOnInit();
    expect(component.userEmail).toBe('user@example.com');
  });

  it('should call logout and navigate to login on logout()', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/login']);
  });

  it('should navigate to add-location page', () => {
    component.navigateToAddLocation();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/add-location']);
  });

  it('should navigate to my-locations page', () => {
    component.navigateToMyLocations();
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/my-locations']);
  });
});
