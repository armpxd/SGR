import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../models/enums/role';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  transform(value: Role): string {
    switch (value) {
      case Role.RRHH:
        return 'Recursos Humanos';
      case Role.Guest:
        return 'Candidato';
      default:
        return 'Desconocido';
    }
  }

}
