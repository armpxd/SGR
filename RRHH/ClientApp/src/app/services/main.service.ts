import { Injectable } from '@angular/core';
import { ComponentService } from './component.service';
import { LoadingPageComponent } from '../components/loading-page/loading-page.component';
import { TmplAstBoundAttribute } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private loading;
  private tm;
  constructor(private componentService: ComponentService) { }

  ShowLoading() {
    if (!this.loading) {
      this.loading = false;
      this.tm = setTimeout(() => {
        if (this.loading === false) {
          this.loading = this.componentService.CreateDynamicComponent(LoadingPageComponent);
        } else {
          this.loading = null;
        }
      }, 300);
    }
  }

  HideLoading() {
    if (this.loading) {
      this.componentService.RemoveComponent(this.loading)
    }
    this.loading = null;
    if (this.tm) {
      clearTimeout(this.tm);
    }
  }

  ValidateCedula(ced: string): boolean {
    // Funcion tomada de https://gist.github.com/ViCMAP/55260ffd138fe150040d
    let c = ced.replace(/-/g, '');
    let cedula = c.substr(0, c.length - 1);
    let verificador = parseInt(c.substr(c.length - 1, 1));
    let suma = 0;
    let cedulaValida = 0;

    if (ced.length < 11) { return false; }

    for (let i = 0; i < cedula.length; i++) {
      let mod: number;
      if ((i % 2) == 0) { mod = 1 } else { mod = 2 }
      let sub: number = parseInt((cedula.substr(i, 1)));
      let res: any = sub * mod;
      if (res > 9) {
        res = res.toString();
        let uno = res.substr(0, 1);
        let dos = res.substr(1, 1);
        res = eval(uno) + eval(dos);
      }
      suma += eval(res);
    }
    let el_numero = (10 - (suma % 10)) % 10;
    if (el_numero == verificador && cedula.substr(0, 3) != "000") {
      cedulaValida = 1;
    }
    else {
      cedulaValida = 0;
    }

    return cedulaValida == 1;
  }

  exportToCSV(rows: any[]) {
    var BOM = "\uFEFF";
    let csvContent = "data:text/csv;charset=utf-8," + BOM + rows.map(e => e.join(";")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "SGR_reporte_empleados.csv");
    document.body.appendChild(link);

    link.click();
  }
}
