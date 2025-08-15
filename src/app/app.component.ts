import { Component } from '@angular/core';
import { PwaUpdateService } from './services/pwa-update.service';
import { PwaDiagnosticService } from './services/pwa-diagnostique.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private pwaDiagnostic: PwaDiagnosticService
  ) {
    this.pwaDiagnostic.checkInstallability();
  }
}
