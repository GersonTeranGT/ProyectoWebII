import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Si existe token, clonar la petición y agregar el header Authorization
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(cloned).pipe(
      catchError((error) => {
        // Si el error es 401 (No autorizado), redirigir al login
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rol');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  // Si no hay token, continuar con la petición original
  return next(req);
};
