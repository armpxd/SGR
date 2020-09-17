import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { MainService } from './main.service';
import { DialogService } from './dialog.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  onHttpError = new Subject<HttpErrorResponse>();

  constructor(private authService: AuthService,
              private mainService: MainService,
              private dialogService: DialogService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.authService.getSessionToken();

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.authService.logout();
          this.mainService.HideLoading(true);
          this.dialogService.showSnack("Su sesión ha espirado");
        }
        else {
          this.onHttpError.next(err);
          this.mainService.HideLoading(true);
          this.dialogService.showSnack(err.message);
        }
        return throwError( err );
      })
    );
  }
}
