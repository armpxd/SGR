import { ICapacitationLevel } from './i-capacitation-level';

export interface ICapacitation {
    capacitacionId: number,
    descripcion: string,
    nivel: ICapacitationLevel,
    desde: Date,
    hasta: Date,
    institucion: string
}