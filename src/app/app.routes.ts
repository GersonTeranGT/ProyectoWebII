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
    //ruta incial - Home
    { path: '', component: Home , canMatch:[publicMatchGuard]},
    { path: 'inicio', redirectTo: '', pathMatch: 'full' },
    
    //rutas publicas
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'register/:id', component: Register },
    
    //rutas protegidas con authGuard (solo usuarios autenticados)
    { path: 'usuarios', component: Usuarios, canActivate: [authGuard], canMatch:[publicMatchGuard]},
    { path: 'historial-test', component: HistorialTest, canActivate: [authGuard], canMatch:[userMatchGuard] },
    { path: 'test', component: Test, canActivate: [authGuard], canMatch:[userMatchGuard]},
    
    //ruta 404
    { path: '**', component: Pagina404 }
];