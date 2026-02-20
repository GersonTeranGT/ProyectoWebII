import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const publicMatchGuard: CanMatchFn = (route, segments) => {
  //inyeccion del auth
  const authService = inject(AuthService);
  //inyeccion para redireccion
  const router = inject(Router)

  //verificamos si nos hay sesion iniciada
  if (!authService.sesionIniciada()) {
    if (route.path === 'login' || route.path === 'register') {
      return router.parseUrl('test')
    }
  }
  return true;
};

//rutas solo para usuarios
export const userMatchGuard: CanMatchFn = (route, segments) => {
  //inyecciones
  const authService = inject(AuthService);
  const router = inject(Router);

  //verificamos si hay sesion 
  if (!authService.sesionIniciada()) {
    return router.parseUrl('login');
  }

  //rutas accesibles solo para el usuario
  if (authService.rolActual() === 'USER') {
    return true;
  }
  return false;
};

//rutas solo para usuarios
export const adminMatchGuard: CanMatchFn = (route, segments) => {
  //inyecciones
  const authService = inject(AuthService);
  const router = inject(Router);

  //verificamos si hay sesion
  if (!authService.sesionIniciada()) {
    return router.parseUrl('login');
  }

  //rutas que solo el administrador puede ver
  if (authService.rolActual() === 'ADMIN') {
    return true;
  }

  //si es USER redirigimos a test
  return router.parseUrl('test');
};