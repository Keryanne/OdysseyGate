import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'app-pwa-install-banner',
  template: `
    <ion-card *ngIf="showBanner" class="install-banner">
      <ion-card-content>
        <div class="banner-content">
          <div class="banner-text">
            <ion-card-title>Installez OdysseyGate</ion-card-title>
            <ion-card-subtitle>Accédez à vos voyages plus facilement</ion-card-subtitle>
          </div>
          <div class="banner-actions">
            <ion-button color="primary" (click)="installApp()">
              <ion-icon name="download-outline" slot="start"></ion-icon>
              Installer
            </ion-button>
            <ion-button fill="clear" (click)="dismissBanner()">
              Plus tard
            </ion-button>
          </div>
        </div>
      </ion-card-content>
    </ion-card>

    <!-- Modal d'instructions -->
    <ion-modal [isOpen]="showInstructions">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>Comment installer l'application</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="showInstructions = false">Fermer</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <h3 *ngIf="isIOS">Sur iOS (Safari)</h3>
          <ol *ngIf="isIOS">
            <li>Appuyez sur <ion-icon name="share-outline"></ion-icon> en bas de l'écran</li>
            <li>Faites défiler et appuyez sur "Sur l'écran d'accueil"</li>
            <li>Appuyez sur "Ajouter" en haut à droite</li>
          </ol>

          <h3 *ngIf="isAndroid">Sur Android (Chrome)</h3>
          <ol *ngIf="isAndroid">
            <li>Appuyez sur le menu <ion-icon name="ellipsis-vertical"></ion-icon> en haut à droite</li>
            <li>Sélectionnez "Installer l'application"</li>
          </ol>

          <h3 *ngIf="!isIOS && !isAndroid">Sur ordinateur</h3>
          <ol *ngIf="!isIOS && !isAndroid">
            <li>Cliquez sur l'icône <ion-icon name="add-outline"></ion-icon> dans la barre d'adresse</li>
            <li>Ou ouvrez le menu (trois points) et sélectionnez "Installer OdysseyGate"</li>
          </ol>

          <div class="screenshots">
            <img *ngIf="isIOS" src="assets/img/ios-install.png" alt="Installation iOS">
            <img *ngIf="isAndroid" src="assets/img/android-install.png" alt="Installation Android">
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    .install-banner {
      position: fixed;
      bottom: 20px;
      left: 16px;
      right: 16px;
      margin: 0;
      z-index: 1000;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .banner-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .banner-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .screenshots {
      margin-top: 20px;
      text-align: center;
    }

    .screenshots img {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    @media (min-width: 768px) {
      .install-banner {
        max-width: 500px;
        left: auto;
        right: 16px;
      }

      .banner-content {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class PwaInstallBannerComponent implements OnInit {
  showBanner = false;
  showInstructions = false;
  isIOS = false;
  isAndroid = false;

  constructor(
    private pwaInstallService: PwaInstallService,
    private platform: Platform
  ) {}

  ngOnInit() {
    // Détection de la plateforme
    this.isIOS = this.platform.is('ios');
    this.isAndroid = this.platform.is('android');

    // Vérifie si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as any).standalone === true;
    
    // Vérifie si le prompt d'installation a été rejeté récemment
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    const isDismissedRecently = dismissedTime && 
      (Date.now() - Number(dismissedTime)) < 7 * 24 * 60 * 60 * 1000; // 7 jours

    // Affiche la bannière si toutes les conditions sont remplies
    if (!isStandalone && !isDismissedRecently) {
      // Pour Safari sur iOS, on montre directement la bannière
      if (this.isIOS) {
        setTimeout(() => this.showBanner = true, 30000); // 30 secondes de délai
        return;
      }

      // Pour les autres navigateurs, on vérifie si le prompt est disponible
      this.pwaInstallService.installable.subscribe(installable => {
        if (installable) {
          setTimeout(() => this.showBanner = true, 10000); // 10 secondes de délai
        }
      });

      // On écoute aussi l'événement de prompt natif
      this.pwaInstallService.installPrompt.subscribe(event => {
        if (event) {
          setTimeout(() => this.showBanner = true, 3000); // 3 secondes de délai
        }
      });
    }
  }

  installApp() {
    // Essaye d'utiliser le prompt natif
    const promptShown = this.pwaInstallService.showInstallPrompt();
    
    // Si pas de prompt natif disponible, affiche les instructions manuelles
    if (!promptShown) {
      this.showInstructions = true;
    }
  }

  dismissBanner() {
    this.showBanner = false;
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }
}
