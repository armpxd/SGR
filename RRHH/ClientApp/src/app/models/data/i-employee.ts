import { IDepartment } from './i-department';
import { IPosition } from './i-position';

export interface IEmployee {
    empleadoId: number,
    cedula: string,
    nombre: string,
    apellidos: string,
    correo: string,
    fechaIngreso: Date,
    puesto: IPosition,
    salario: number,
    estado: boolean
}