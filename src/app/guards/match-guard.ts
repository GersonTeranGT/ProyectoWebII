import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// Guard para rutas públicas (login, register)
export const publicMatchGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si la ruta actual es exactamente 'register' o 'login' (sin parámetros)
  const path = route.path;
  
  // Si el usuario está autenticado y trata de entrar a login o register
  if (authService.sesionIniciada() && (path === 'login' || path === 'register')) {
    // Redirigir según el rol
    if (authService.esAdmin()) {
      return router.parseUrl('usuarios');
    } else {
      return router.parseUrl('test');
    }
  }

  // Si no está autenticado o no es login/register, puede ver la ruta
  return true;
};

// Guard para rutas de usuarios normales
export const userMatchGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay sesión iniciada
  if (!authService.sesionIniciada()) {
    return router.parseUrl('login');
  }

  // Usuario normal puede acceder
  if (authService.rolActual() === 'ROLE_USUARIO') {
    return true;
  }

  // Admin no puede acceder a rutas de usuario
  return router.parseUrl('usuarios');
};

// Guard para rutas de administrador
export const adminMatchGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay sesión iniciada
  if (!authService.sesionIniciada()) {
    return router.parseUrl('login');
  }

  // Admin puede acceder
  if (authService.rolActual() === 'ROLE_ADMIN') {
    return true;
  }

  // Usuario normal no puede acceder a rutas de admin
  return router.parseUrl('test');
};