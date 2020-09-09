import { Pipe, PipeTransform } from '@angular/core';
import { NivelRiesgo } from '../models/enums/nivel-riesgo';

@Pipe({
  name: 'nivelriesgo'
})
export class NivelriesgoPipe implements PipeTransform {

  transform(value: NivelRiesgo): string {
    switch(value) {
      case NivelRiesgo.Bajo:
        return 'Bajo';
      case NivelRiesgo.Medio:
        return 'Medio';
      case NivelRiesgo.Alto:
        return 'Alto';
      default:
        return 'Desconocido';
    }
  }

}
