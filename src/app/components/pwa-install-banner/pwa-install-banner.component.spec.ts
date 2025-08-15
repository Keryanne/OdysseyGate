import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
import { PwaInstallBannerComponent } from './pwa-install-banner.component';
import { PwaInstallService } from '../../services/pwa-install.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PwaInstallBannerComponent', () => {
  let component: PwaInstallBannerComponent;
  let fixture: ComponentFixture<PwaInstallBannerComponent>;
  let pwaInstallServiceMock: any;
  let platformMock: any;
  
  // Mock pour l'API matchMedia du navigateur
  function createMatchMediaMock(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  }

  beforeEach(waitForAsync(() => {
    // Mock du service PwaInstallService
    pwaInstallServiceMock = {
      installable: new BehaviorSubject<boolean>(false),
      installPrompt: new BehaviorSubject<any>(null),
      showInstallPrompt: jest.fn().mockReturnValue(false)
    };
    
    // Mock du service Platform
    platformMock = {
      is: jest.fn(platform => false)
    };
    
    // Configuration du module de test
    TestBed.configureTestingModule({
      declarations: [PwaInstallBannerComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: PwaInstallService, useValue: pwaInstallServiceMock },
        { provide: Platform, useValue: platformMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Pour les éléments Ionic
    }).compileComponents();

    // Simuler une application qui n'est pas encore installée
    createMatchMediaMock(false);
    
    // Supprimer les préférences d'installation stockées
    localStorage.removeItem('pwa-install-dismissed');

    fixture = TestBed.createComponent(PwaInstallBannerComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should detect iOS platform correctly', () => {
    platformMock.is.mockImplementation((platform: string) => platform === 'ios');
    fixture.detectChanges();
    
    expect(component.isIOS).toBe(true);
    expect(component.isAndroid).toBe(false);
  });

  it('should detect Android platform correctly', () => {
    platformMock.is.mockImplementation((platform: string) => platform === 'android');
    fixture.detectChanges();
    
    expect(component.isIOS).toBe(false);
    expect(component.isAndroid).toBe(true);
  });

  it('should not show banner if app is already installed (standalone mode)', () => {
    // Simuler une application déjà installée
    createMatchMediaMock(true);
    fixture.detectChanges();
    
    expect(component.showBanner).toBe(false);
  });

  it('should not show banner if it was recently dismissed', () => {
    // Simuler un rejet récent
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    fixture.detectChanges();
    
    expect(component.showBanner).toBe(false);
  });

  it('should show banner immediately for iOS after delay', fakeAsync(() => {
    platformMock.is.mockImplementation((platform: string) => platform === 'ios');
    fixture.detectChanges();
    
    expect(component.showBanner).toBe(false);
    
    // Avancer le temps de 30 secondes
    tick(30000);
    
    expect(component.showBanner).toBe(true);
  }));

  it('should show banner when app becomes installable', fakeAsync(() => {
    fixture.detectChanges();
    
    expect(component.showBanner).toBe(false);
    
    // Simuler que l'application devient installable
    pwaInstallServiceMock.installable.next(true);
    
    // Avancer le temps de 10 secondes
    tick(10000);
    
    expect(component.showBanner).toBe(true);
  }));

  it('should show banner when install prompt is available', fakeAsync(() => {
    fixture.detectChanges();
    
    expect(component.showBanner).toBe(false);
    
    // Simuler un événement de prompt d'installation
    pwaInstallServiceMock.installPrompt.next({});
    
    // Avancer le temps de 3 secondes
    tick(3000);
    
    expect(component.showBanner).toBe(true);
  }));

  it('should dismiss banner and store preference when dismissed', () => {
    component.showBanner = true;
    fixture.detectChanges();
    
    component.dismissBanner();
    
    expect(component.showBanner).toBe(false);
    expect(localStorage.getItem('pwa-install-dismissed')).not.toBeNull();
  });

  it('should try to show install prompt when install button is clicked', () => {
    fixture.detectChanges();
    component.showBanner = true;
    
    // Configurer le mock pour simuler un prompt disponible
    pwaInstallServiceMock.showInstallPrompt.mockReturnValue(true);
    
    component.installApp();
    
    expect(pwaInstallServiceMock.showInstallPrompt).toHaveBeenCalled();
    expect(component.showInstructions).toBe(false);
  });

  it('should show instructions when no install prompt is available', () => {
    fixture.detectChanges();
    component.showBanner = true;
    
    // Configurer le mock pour simuler qu'aucun prompt n'est disponible
    pwaInstallServiceMock.showInstallPrompt.mockReturnValue(false);
    
    component.installApp();
    
    expect(pwaInstallServiceMock.showInstallPrompt).toHaveBeenCalled();
    expect(component.showInstructions).toBe(true);
  });
});
