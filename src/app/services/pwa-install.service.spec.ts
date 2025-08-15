import { TestBed, fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';
import { PwaInstallService } from './pwa-install.service';
import { skip } from 'rxjs/operators';

describe('PwaInstallService', () => {
  let service: PwaInstallService;
  
  // Mock pour l'API matchMedia
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

  // Configuration initiale avant chaque test
  beforeEach(() => {
    // Réinitialisation des propriétés du document et de la fenêtre
    jest.clearAllMocks();
    
    // Mock pour document.querySelector
    const originalQuerySelector = document.querySelector;
    Object.defineProperty(document, 'querySelector', {
      writable: true,
      value: jest.fn().mockImplementation((selector: string) => {
        // Simule la présence du manifest
        if (selector === 'link[rel="manifest"]') {
          return {}; // Retourne un objet non-null pour indiquer que le manifest existe
        }
        return originalQuerySelector.call(document, selector);
      })
    });
    
    // Mock pour navigator.serviceWorker
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: {
        ...window.navigator,
        serviceWorker: {}
      }
    });
    
    // Simule une application qui n'est pas en standalone mode
    createMatchMediaMock(false);
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaInstallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect that app is installable with manifest and service worker', (done) => {
    service.installable.subscribe(installable => {
      expect(installable).toBe(true);
      done();
    });
  });

  it('should not detect app as installable if already in standalone mode', fakeAsync(() => {
    // Mock setup comme avant
    createMatchMediaMock(true);
    Object.defineProperty(window.navigator, 'standalone', { value: true });
    
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    
    const standaloneService = TestBed.inject(PwaInstallService);
    // @ts-ignore
    jest.spyOn(standaloneService, 'initInstallPrompt').mockImplementation(() => {});
    
    let capturedValue: boolean | undefined;
    standaloneService.installable.subscribe(value => {
      capturedValue = value;
    });
    
    tick(100);
    
    expect(capturedValue).toBe(false);
    
    // Éliminer tous les timers restants
    discardPeriodicTasks();
    flush();
  }));

  it('should set installable to true after timeout even without prompt', fakeAsync(() => {
    let isInstallable = false;
    
    service.installable.subscribe(value => {
      isInstallable = value;
    });
    
    // Avancer le temps de 15 secondes
    tick(15000);
    
    expect(isInstallable).toBe(true);
  }));

  it('should handle beforeinstallprompt event correctly', () => {
    // Mock un événement beforeinstallprompt
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    // Dispatch l'événement
    const beforeInstallPromptEvent = new CustomEvent('beforeinstallprompt');
    Object.assign(beforeInstallPromptEvent, mockEvent);
    window.dispatchEvent(beforeInstallPromptEvent);
    
    // Vérifier que preventDefault a été appelé
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    
    // Vérifier que l'événement a été capturé par le service
    service.installPrompt.subscribe(event => {
      if (event) {
        expect(event).toBe(mockEvent);
      }
    });
  });

  it('should handle appinstalled event correctly', (done) => {
    // D'abord simuler que l'app est installable
    service.installable.pipe(skip(1)).subscribe(installable => {
      // Après l'événement appinstalled, installable devrait être false
      expect(installable).toBe(false);
      done();
    });
    
    // Déclencher l'événement appinstalled
    window.dispatchEvent(new Event('appinstalled'));
  });

  it('should return false from showInstallPrompt if no prompt is available', () => {
    const result = service.showInstallPrompt();
    expect(result).toBe(false);
  });

  it('should trigger prompt and return true when prompt is available', () => {
    // Mock un événement beforeinstallprompt
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    // Injecter manuellement l'événement dans le service
    // Simuler que l'événement beforeinstallprompt a été déclenché
    const beforeInstallPromptEvent = new CustomEvent('beforeinstallprompt');
    Object.assign(beforeInstallPromptEvent, mockEvent);
    window.dispatchEvent(beforeInstallPromptEvent);
    
    // Appeler showInstallPrompt
    const result = service.showInstallPrompt();
    
    // Vérifier que prompt a été appelé et que true est retourné
    expect(mockEvent.prompt).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  
  it('should handle user acceptance of installation', async () => {
    // Mock un événement avec une promesse résolue à "accepted"
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    
    // Simuler l'événement beforeinstallprompt
    const beforeInstallPromptEvent = new CustomEvent('beforeinstallprompt');
    Object.assign(beforeInstallPromptEvent, mockEvent);
    window.dispatchEvent(beforeInstallPromptEvent);
    
    // Appeler showInstallPrompt
    service.showInstallPrompt();
    
    // Attendre que la promesse userChoice soit résolue
    await mockEvent.userChoice;
    
    // Vérifier que deferredPrompt est remis à null
    service.installPrompt.subscribe(prompt => {
      expect(prompt).toBeNull();
    });
  });

  it('should handle user rejection of installation', async () => {
    // Mock un événement avec une promesse résolue à "dismissed"
    const mockEvent = {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed' })
    };
    
    // Simuler l'événement beforeinstallprompt
    const beforeInstallPromptEvent = new CustomEvent('beforeinstallprompt');
    Object.assign(beforeInstallPromptEvent, mockEvent);
    window.dispatchEvent(beforeInstallPromptEvent);
    
    // Appeler showInstallPrompt
    service.showInstallPrompt();
    
    // Attendre que la promesse userChoice soit résolue
    await mockEvent.userChoice;
    
    // Vérifier que deferredPrompt est remis à null
    service.installPrompt.subscribe(prompt => {
      expect(prompt).toBeNull();
    });
  });
});