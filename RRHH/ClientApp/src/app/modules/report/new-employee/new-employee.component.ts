import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from '../../../services/data/report.service';
import { IEmployee } from 'src/app/models/data/i-employee';
import { MainService } from 'src/app/services/main.service';
import { DialogService } from 'src/app/services/dialog.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss']
})
export class NewEmployeeComponent implements OnInit {

  frmGroup = new FormGroup({
    desde: new FormControl(new Date()),
    hasta: new FormControl(new Date())
  });

  TABLEDATA: IEmployee[] = [];
  paginatorOptions = { itemsPerPage: 50, currentPage: 0}

  constructor(private resportService: ReportService,
              private mainService: MainService,
              private dialogSerice: DialogService,
              @Inject(LOCALE_ID) private locale: string) { }

  ngOnInit(): void {

  }

  preview() {
    this.TABLEDATA = [];
    this.mainService.ShowLoading();
    this.resportService.GetNewEmployee(this.frmGroup.value).subscribe(response => {
      this.mainService.HideLoading();
      this.TABLEDATA = response;
    });
  }

  exportToCSV() {

    if(this.TABLEDATA.length == 0) {
      this.dialogSerice.showSnack('No hay datos para exportar');
      return;
    }

    let rows: any[] = [];

    rows.push([
      'Reporte de empleados'
    ]);

    rows.push([
      'Desde:',
      formatDate(this.frmGroup.value.desde,'yyyy-MM-dd', this.locale),
    ]);
    rows.push([
      'Hasta:',
      formatDate(this.frmGroup.value.hasta,'yyyy-MM-dd', this.locale),
    ]);
    rows.push([]);

    rows.push([
      'Nombre',
      'Apellidos',
      'Cedula',
      'Correo',
      'Departamento',
      'Puesto',
      'Fecha Ingreso',
      'Salario',
      'Estado'
    ]);

    for(const x of this.TABLEDATA) {
      rows.push([
        x.nombre,
        x.apellidos,
        x.cedula,
        x.correo,
        x.puesto?.departamento?.descripcion,
        x.puesto?.descripcion,
        formatDate(x.fechaIngreso,'yyyy-MM-dd', this.locale),
        x.salario,
        (x.estado ? 'Activo' : 'Inactivo')
      ]);
    }
    this.mainService.exportToCSV(rows);
  }
}
