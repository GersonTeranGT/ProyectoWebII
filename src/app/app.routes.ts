import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Pagina404 } from './features/pagina404/pagina404';


export const routes: Routes = [
    //1. ruta incial
    {path:'', component:Home},
    //3. redireccion si el usuario escribe una url no existe
    {path:'**', component:Pagina404}
];
