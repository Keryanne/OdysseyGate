import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugin } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    // Importer dynamiquement le plugin Keyboard
    const { Keyboard } = await import('@capacitor/keyboard');
    
    // Ajouter des classes au body lors de l'ouverture/fermeture du clavier
    Keyboard.addListener('keyboardWillShow', () => {
      document.body.classList.add('keyboard-is-open');
    });
    
    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-is-open');
    });
  }
}
