import { State } from '../enums/state';

export interface ILanguage {
    idiomaId?: number,
    descripcion: string,
    estado?: State
}
