import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Pagina404 } from './features/pagina404/pagina404';
import { Login } from './features/login/login';
import { Usuarios } from './features/usuarios/usuarios';
import { HistorialTest } from './features/historial-test/historial-test';
import { Test } from './features/test/test';
import { Register } from './features/register/register';


export const routes: Routes = [
    //1. ruta incial
    {path:'', component:Home},
    //2. rutas de navegacion
    {path:'login', component:Login},
    {path:'usuarios', component:Usuarios},
    {path:'historial-test', component:HistorialTest},
    {path:'test', component:Test},
    {path:'register', component:Register},
    // Ruta para registro CON parametro (edición)
    {path:'register/:id', component: Register},
    
    //3. redireccion si el usuario escribe una url no existe
    {path:'**', component:Pagina404}
];
