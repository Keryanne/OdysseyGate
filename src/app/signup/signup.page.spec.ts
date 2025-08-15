import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { SignupPage } from './signup.page';
import { AuthService } from '../services/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('SignupPage', () => {
  let component: SignupPage;
  let fixture: ComponentFixture<SignupPage>;
  let authService: AuthService;
  let alertController: AlertController;
  let navController: NavController;

  const presentSpy = jest.fn();
  const alertControllerSpy = {
    create: jest.fn().mockResolvedValue({ present: presentSpy })
  };
  const navControllerSpy = {
    navigateRoot: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignupPage],
      imports: [FormsModule, IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn()
          }
        },
        {
          provide: AlertController,
          useValue: alertControllerSpy
        },
        {
          provide: NavController,
          useValue: navControllerSpy
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPage);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    alertController = TestBed.inject(AlertController);
    navController = TestBed.inject(NavController);
  }));

  it('should create the SignupPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should call register and navigate on success', waitForAsync(async () => {
    jest.spyOn(authService, 'register').mockReturnValue(of({ success: true }));
    component.name = 'newname';
    component.surname = 'newsurname';
    component.email = 'new@example.com';
    component.password = 'Password123!'; // Mot de passe complexe
    component.confirmPassword = 'Password123!';

    await component.register();
    await fixture.whenStable();

    expect(authService.register).toHaveBeenCalledWith('newname', 'newsurname', 'new@example.com', 'Password123!', 'Password123!');

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Inscription réussie',
      message: 'Ton compte a bien été créé !',
      buttons: ['OK']
    });
    expect(presentSpy).toHaveBeenCalled();
    expect(navController.navigateRoot).toHaveBeenCalledWith(['/tabs/login']);
  }));

  it('should show error alert on register failure', waitForAsync(async () => {
    jest.spyOn(authService, 'register').mockReturnValue(
      throwError(() => ({ error: { message: 'Une erreur est survenue' } }))
    );

    component.name = 'fail';
    component.surname = 'fail';
    component.email = 'fail@example.com';
    component.password = 'Abcdef12!'; // Mot de passe complexe
    component.confirmPassword = 'Abcdef12!';

    await component.register();
    await fixture.whenStable();

    expect(authService.register).toHaveBeenCalled();
    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Inscription échouée',
      message: 'Une erreur est survenue',
      buttons: ['OK']
    });
    expect(presentSpy).toHaveBeenCalled();
  }));

  it('should show alert if password is not complex enough', waitForAsync(async () => {
    component.name = 'John';
    component.surname = 'Doe';
    component.email = 'john@example.com';
    component.password = 'simple'; // Mot de passe trop simple
    component.confirmPassword = 'simple';

    await component.register();
    await fixture.whenStable();

    expect(alertController.create).toHaveBeenCalledWith({
      header: 'Mot de passe trop simple',
      message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
      buttons: ['OK']
    });
    expect(presentSpy).toHaveBeenCalled();
    expect(authService.register).not.toHaveBeenCalled();
  }));

  it('should navigate to login page when goToLogin is called', () => {
    component.goToLogin();
    expect(navController.navigateRoot).toHaveBeenCalledWith(['/tabs/login']);
  });

  it('should validate password complexity (isPasswordComplex)', () => {
    expect(component['isPasswordComplex']('Abcdef12!')).toBe(true); // complexe
    expect(component['isPasswordComplex']('abcdef12')).toBe(false); // pas de majuscule ni de spécial
    expect(component['isPasswordComplex']('ABCDEF12!')).toBe(false); // pas de minuscule
    expect(component['isPasswordComplex']('Abcdefgh!')).toBe(false); // pas de chiffre
    expect(component['isPasswordComplex']('Abc1!')).toBe(false); // trop court
  });
});
