export interface Usuario {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    rol: 'ADMIN' | 'USER';
}