export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
    username: string;
    password: string;
    rol: 'ROLE_ADMIN' | 'ROLE_USUARIO';
}