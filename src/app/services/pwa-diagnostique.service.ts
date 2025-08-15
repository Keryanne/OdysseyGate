import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaDiagnosticService {
  
  constructor() {}
  
  async checkInstallability() {
    console.log('--- Diagnostic d\'installabilité PWA ---');
    
    // 1. Vérifier si le navigateur supporte les PWA
    console.log('✓ Service Worker supporté:', 'serviceWorker' in navigator);
    
    // 2. Vérifier si le manifest existe et est valide
    const manifestLink = document.querySelector('link[rel="manifest"]');
    console.log('✓ Manifest déclaré:', !!manifestLink);
    
    if (manifestLink) {
      try {
        const manifestUrl = manifestLink.getAttribute('href');
        const response = await fetch(manifestUrl || '');
        const manifestData = await response.json();
        console.log('✓ Manifest chargé:', true);
        console.log('✓ Manifest contient des icônes:', manifestData.icons && manifestData.icons.length > 0);
        console.log('✓ Manifest contient name:', !!manifestData.name);
        console.log('✓ Manifest contient short_name:', !!manifestData.short_name);
        console.log('✓ Manifest a display standalone/fullscreen:', 
          ['standalone', 'fullscreen'].includes(manifestData.display));
      } catch (e) {
        console.error('✗ Erreur de chargement du manifest:', e);
      }
    }
    
    // 3. Vérifier si le Service Worker est enregistré
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log('✓ Service Worker enregistré:', registrations.length > 0);
      registrations.forEach(reg => {
        console.log('  - SW scope:', reg.scope);
      });
    }
    
    // 4. Vérifier si HTTPS
    console.log('✓ HTTPS:', window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    
    // 5. Vérifier si déjà installé
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
    console.log('✓ Déjà installé en standalone:', isStandalone);
    
    console.log('--- Fin du diagnostic ---');
  }
}