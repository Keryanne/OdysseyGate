import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaInstallService {
  private deferredPrompt: any;
  private installPromptEvent = new BehaviorSubject<any>(null);
  
  // Cette variable permettra d'afficher le bouton même sans prompt
  private isInstallable = new BehaviorSubject<boolean>(false);

  public get installPrompt() {
    return this.installPromptEvent.asObservable();
  }
  
  public get installable() {
    return this.isInstallable.asObservable();
  }

  constructor() {
    this.initInstallPrompt();
    
    // Détecte si l'appli répond aux critères basiques d'installabilité
    const hasManifest = !!document.querySelector('link[rel="manifest"]');
    const hasServiceWorker = 'serviceWorker' in navigator;
    const isHttps = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;
    
    // Si les conditions sont remplies mais pas en standalone
    if (hasManifest && hasServiceWorker && isHttps && !isStandalone) {
      this.isInstallable.next(true);
    }
    setTimeout(() => {
    if (!this.installPromptEvent.value) {
        console.log('Forçage du mode installable après délai');
        this.isInstallable.next(true);
    }
    }, 15000);
  }

  private initInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.installPromptEvent.next(e);
      this.isInstallable.next(true);
      console.log('L\'application peut être installée', e);
    });

    window.addEventListener('appinstalled', () => {
      this.installPromptEvent.next(null);
      this.isInstallable.next(false);
      this.deferredPrompt = null;
      console.log('Application installée avec succès');
    });
  }

  public showInstallPrompt(): boolean {
    if (!this.deferredPrompt) {
      console.log('Aucun prompt d\'installation disponible');
      return false;
    }

    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Utilisateur a accepté l\'installation');
      } else {
        console.log('Utilisateur a refusé l\'installation');
      }
      this.deferredPrompt = null;
      this.installPromptEvent.next(null);
    });
    
    return true;
  }
}