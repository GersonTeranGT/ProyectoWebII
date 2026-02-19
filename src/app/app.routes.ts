import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Pagina404 } from './features/pagina404/pagina404';
import { Login } from './features/login/login';
import { Usuarios } from './features/usuarios/usuarios';
import { HistorialTest } from './features/historial-test/historial-test';
import { Test } from './features/test/test';
import { Register } from './features/register/register';
import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
    // Ruta incial - Home
    { path: '', component: Home },
    { path: 'inicio', redirectTo: '', pathMatch: 'full' },
    
    // Rutas públicas
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'register/:id', component: Register },
    
    // Rutas protegidas con authGuard (solo usuarios autenticados)
    { path: 'usuarios', component: Usuarios, canActivate: [authGuard] },
    { path: 'historial-test', component: HistorialTest, canActivate: [authGuard] },
    { path: 'test', component: Test, canActivate: [authGuard] },
    
    // Ruta 404
    { path: '**', component: Pagina404 }
];