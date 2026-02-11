import { Routes } from '@angular/router';
import { Home } from './features/home/home';


export const routes: Routes = [
    //1. ruta incial
    {path:'', component:Home},
    //3. redireccion si el usuario escribe una url no existe
    //{path:'**', component:Error}
];
