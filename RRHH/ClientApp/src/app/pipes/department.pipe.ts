import { Pipe, PipeTransform } from '@angular/core';
import { IPosition } from '../models/data/i-position';
import { IDepartment } from '../models/data/i-department';

@Pipe({
  name: 'department'
})
export class DepartmentPipe implements PipeTransform {

  transform(value: IPosition[], dept: IDepartment): IPosition[] {
    if(!value || !dept) return [];

    return value.filter(x=> x.departamento.departamentoId == dept.departamentoId);
  }

}
