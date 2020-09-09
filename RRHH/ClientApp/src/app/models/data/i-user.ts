import { Role } from '../enums/role';

export interface IUser {
    usuarioId: number,
    nombreUsuario: string,
    nombre: string,
    apellidos: string,
    correo: string,
    estado: boolean
    role: Role
}