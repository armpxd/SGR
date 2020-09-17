import { IPosition } from './i-position';
import { IUser } from './i-user';
import { ISkill } from './i-skill';
import { ILanguage } from './i-language';
import { IWorkExperience } from './i-work-experience';
import { ICapacitation } from './i-capacitation';
import { State } from '../enums/state';

export interface IAspirant{
    candidatoId: number,
    cedula: string,
    nombre: string,
    apellidos: string,
    telefono: string,
    correo: string,
    salarioAspira: number,
    recomendadoPor: string,
    puesto: IPosition,
    usuario: IUser,
    fechaCreacion: Date,
    estado: State,
    competencias: ISkill[],
    capacitaciones: ICapacitation[],
    experienciasLaboral: IWorkExperience[],
    idiomas: ILanguage[]
}