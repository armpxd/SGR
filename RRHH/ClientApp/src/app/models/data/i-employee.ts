import { IDepartment } from './i-department';
import { IPosition } from './i-position';
import { IAspirant } from './i-aspirant';
import { State } from '../enums/state';

export interface IEmployee {
    empleadoId: number,
    cedula: string,
    nombre: string,
    apellidos: string,
    correo: string,
    fechaIngreso: Date,
    puesto: IPosition,
    salario: number,
    candidato?: IAspirant,
    estado: State
}