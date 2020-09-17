import { Role } from '../enums/role';
import { State } from '../enums/state';

export interface IUser {
    usuarioId: number,
    nombreUsuario: string,
    nombre: string,
    clave: string,
    cedula: string,
    telefono: string,
    apellidos: string,
    correo: string,
    estado: State
    role: Role
}