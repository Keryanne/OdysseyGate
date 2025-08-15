import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomePage } from './welcome.page';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

describe('WelcomePage', () => {
  let component: WelcomePage;
  let fixture: ComponentFixture<WelcomePage>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    authServiceMock = { isLoggedIn: jest.fn() };
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      declarations: [WelcomePage],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return isLoggedIn true if AuthService returns true', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);
    expect(component.isLoggedIn).toBe(true);
  });

  it('should return isLoggedIn false if AuthService returns false', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);
    expect(component.isLoggedIn).toBe(false);
  });

  it('should navigate to add-trip when goToAddTrip is called', () => {
    component.goToAddTrip();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add-trip']);
  });

  it('should navigate to my-trips when goToMyTrips is called', () => {
    component.goToMyTrips();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/my-trips']);
  });

  it('should navigate to register when goToRegister is called', () => {
    component.goToRegister();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/register']);
  });

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/tabs/login']);
  });
});
