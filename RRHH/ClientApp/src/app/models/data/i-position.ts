import { NivelRiesgo } from '../enums/nivel-riesgo';
import { IDepartment } from './i-department';
import { State } from '../enums/state';

export interface IPosition {
    puestoId: number,
    descripcion: string;
    departamento: IDepartment,
    nivelDeRiesgo: NivelRiesgo,
    salarioMinimo: number,
    salarioMaximo: number,
    estado: State
}