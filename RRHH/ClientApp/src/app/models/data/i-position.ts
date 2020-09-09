import { NivelRiesgo } from '../enums/nivel-riesgo';
import { IDepartment } from './i-department';

export interface IPosition {
    puestoId: number,
    descripcion: string;
    departamento: IDepartment,
    nivelDeRiesgo: NivelRiesgo,
    salarioMinimo: number,
    salarioMaximo: number,
    estado: boolean
}