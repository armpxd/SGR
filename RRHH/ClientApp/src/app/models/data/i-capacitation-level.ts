import { State } from '../enums/state';

export interface ICapacitationLevel {
    nivelCapacitacionId?: number,
    descripcion: string,
    estado?: State
}
