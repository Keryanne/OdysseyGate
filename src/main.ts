import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  document.body.addEventListener('mousedown', function() {
  document.body.classList.add('mouse-user');
});

document.body.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.remove('mouse-user');
  }
});
