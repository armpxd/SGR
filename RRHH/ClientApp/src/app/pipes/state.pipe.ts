import { Pipe, PipeTransform } from '@angular/core';
import { State } from '../models/enums/state';
@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(value: State): string {

    switch(value) {
      case 0:
        return 'Inactivo';
      case 1:
        return 'Activo';
      case 2:
        return 'Eliminado';
      default:
        return 'Desconocido';
    }
  }
}
