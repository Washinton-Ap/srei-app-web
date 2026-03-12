import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //const token = localStorage.getItem('token');
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router);
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  
  return next(authReq).pipe(
    // en caso de caducar la session te Redirige al login 
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // token expirado o inválido
        authService.logout();

        router.navigateByUrl('/login');
      }

      return throwError(() => error);
    }),
  );
};
