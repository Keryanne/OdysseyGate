import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginPage (Jest)', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let authService: AuthService;
  let alertController: AlertController;
  let router: Router;

  const mockAlert = {
    present: jest.fn()
  };

  const navControllerMock = {
    navigateForward: jest.fn(),
    navigateBack: jest.fn(),
    navigateRoot: jest.fn()
  };

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [FormsModule, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn()
          }
        },
        {
          provide: AlertController,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAlert)
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
        {
          provide: NavController,
          useValue: navControllerMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertController = TestBed.inject(AlertController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }));

  it('should create the login page', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate', waitForAsync(async () => {
    jest.spyOn(authService, 'login').mockReturnValue(of({ access_token: 'abc123' }));
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    component.email = 'user@exemple.com';

    component.password = 'pass';

    component.login();

    await fixture.whenStable();

    expect(authService.login).toHaveBeenCalledWith('user@exemple.com', 'pass');
    expect(setItemSpy).toHaveBeenCalledWith('token', 'abc123');
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/welcome']);
  }));

  it('should show alert on login failure', waitForAsync(async () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Invalid credentials')));
    component.email = 'wrong';
    component.password = 'wrong';

    component.login();

    await fixture.whenStable();
    await fixture.whenRenderingDone(); // ← attendre aussi le rendu Angular

    expect(authService.login).toHaveBeenCalled();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Connection échoué',
      message: 'Email ou mot de passe invalide',
      buttons: ['OK']
    });
    expect(mockAlert.present).toHaveBeenCalled();
  }));
});
