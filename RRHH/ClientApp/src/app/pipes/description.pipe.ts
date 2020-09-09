import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'description'
})
export class DescriptionPipe implements PipeTransform {

  transform(value: any): string {
    if(!value) return value;

    return value.descripcion;
  }

}
