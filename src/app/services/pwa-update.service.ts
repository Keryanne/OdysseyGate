import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController
  ) {
    this.checkForUpdates();
  }

  checkForUpdates() {
    if (this.swUpdate.isEnabled) {
      // Vérification des mises à jour au démarrage
      this.swUpdate.versionUpdates.subscribe(async (event) => {
        if (event.type === 'VERSION_READY') {
          const toast = await this.toastCtrl.create({
            message: 'Une nouvelle version est disponible !',
            position: 'bottom',
            buttons: [
              {
                text: 'Mettre à jour',
                role: 'confirm',
                handler: () => {
                  window.location.reload();
                }
              }
            ]
          });
          await toast.present();
        }
      });

      // Vérification périodique des mises à jour (toutes les 6 heures)
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }
}