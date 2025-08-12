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
          this.alertController.create({
            header: 'Non connecté',
            message: 'Vous devez être connecté pour accéder à cette page.',
            buttons: [
              {
                text: 'Se connecter',
                handler: () => {
                  this.router.navigate(['/tabs/login']);
                }
              }
            ]
          }).then(alert => alert.present());
        }

        return throwError(() => error);
      })
    );
  }
}
