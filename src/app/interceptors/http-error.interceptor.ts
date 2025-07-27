import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.removeItem('token');

          this.alertController.create({
            header: 'Session expirée',
            message: 'Tu as été déconnecté(e). Merci de te reconnecter.',
            buttons: ['OK']
          }).then(alert => {
            alert.present().then(() => {
              this.router.navigate(['/tabs/login']);
            });
          });
        }

        return throwError(() => error);
      })
    );
  }
}
