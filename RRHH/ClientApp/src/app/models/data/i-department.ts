import { State } from '../enums/state';

export interface IDepartment {
    departamentoId?: number,
    descripcion: string,
    estado?: State
}
