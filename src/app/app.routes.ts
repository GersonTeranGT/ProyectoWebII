import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Pagina404 } from './features/pagina404/pagina404';
import { Login } from './features/login/login';
import { Usuarios } from './features/usuarios/usuarios';
import { HistorialTest } from './features/historial-test/historial-test';
import { Test } from './features/test/test';
import { Register } from './features/register/register';
import { authGuard } from './guards/auth-guard';
import { adminMatchGuard, publicMatchGuard, userMatchGuard } from './guards/match-guard';


export const routes: Routes = [
    // Ruta inicial - Home (pública)
  { path: '', component: Home },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
  
  { path: 'register/:id', component: Register, canMatch: [authGuard] }, // canMatch, no canActivate
  // Rutas públicas
  { path: 'login', component: Login, canMatch: [publicMatchGuard] },
  { path: 'register', component: Register, canMatch: [publicMatchGuard] },
  
  
  // Rutas SOLO para usuarios normales (NO admin)
  { 
    path: 'test', 
    component: Test, 
    canMatch: [userMatchGuard] // Usando canMatch
  },
  { 
    path: 'historial-test', 
    component: HistorialTest, 
    canMatch: [userMatchGuard] // Usando canMatch
  },
  
  // Ruta de usuarios - SOLO admin
  { 
    path: 'usuarios', 
    component: Usuarios, 
    canMatch: [publicMatchGuard] // Usando canMatch
  },
  
  // Ruta 404
  { path: '**', component: Pagina404 }

];