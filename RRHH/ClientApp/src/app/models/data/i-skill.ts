import { State } from '../enums/state';

export interface ISkill {
    competenciaId?: number,
    descripcion: string,
    estado?: State
}
