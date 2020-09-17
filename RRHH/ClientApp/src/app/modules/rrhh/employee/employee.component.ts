import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/data/employee.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IEmployee } from 'src/app/models/data/i-employee';
import { DepartmentService } from 'src/app/services/data/department.service';
import { PositionService } from 'src/app/services/data/position.service';
import { IDepartment } from 'src/app/models/data/i-department';
import { IPosition } from 'src/app/models/data/i-position';
import { State } from 'src/app/models/enums/state';
import { ErrorStateMatcher } from '@angular/material/core';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  TABLEDATA: IEmployee[] = [];
  FILTERED_TABLEDATA: IEmployee[] = [];
  DEPARTMENTS: IDepartment[] = [];
  POSITIONS: IPosition[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: IEmployee = null;

  frmGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null),
    cedula: new FormControl(null, [Validators.required]),
    correo: new FormControl(null, [Validators.required, Validators.email]),
    fechaIngreso: new FormControl(null, [Validators.required]),
    departamento: new FormControl(null, [Validators.required]),
    puesto: new FormControl(null, [Validators.required]),
    salario: new FormControl(null, [Validators.required, Validators.min(0)]),
    estado: new FormControl(State.Activo),
  });

  constructor(private apiService: EmployeeService,
              private dialogService: DialogService,
              private mainService: MainService,
              private departmentService: DepartmentService,
              private positionService: PositionService) { }

  ngOnInit(): void {
    this.getAll();
    this.getDepartments();
    this.getPositions();
  }

  getAll() {
    this.mainService.ShowLoading();
    this.apiService.GetAll().subscribe(response => {
      this.mainService.HideLoading();
      this.TABLEDATA = this.FILTERED_TABLEDATA = response;
    });
  }

  getDepartments() {
    this.departmentService.GetAll(false).subscribe(response => {
      this.DEPARTMENTS = response;
    });
  }

  getPositions() {
    this.positionService.GetAll(false).subscribe(response => {
      this.POSITIONS = response;
    });
  }

  validateForm(): boolean {
    this.frmGroup.markAllAsTouched();
    const valid = this.frmGroup.valid;
    if(!valid || !this.frmGroup.controls.puesto.value || !this.frmGroup.controls.departamento.value) {
      this.dialogService.showSnack('Algunos campos son inválidos. Favor verificar');
      return false;
    } else {
      const position: IPosition = this.frmGroup.value.puesto;
      const salary = this.frmGroup.value.salario;
      if (salary < position.salarioMinimo || salary > position.salarioMaximo) {
        this.dialogService.showSnack(`El salario no se encuentra en el rango configurado para este puesto. (${position.salarioMinimo} - ${position.salarioMaximo})`, 5000);
        return false;
      }
    }

    if(!this.mainService.ValidateCedula(this.frmGroup.value.cedula)) {
      this.dialogService.showSnack('Cédula inválida.');
      return false;
    }
    return valid;
  }

  save() {
    if(this.validateForm()) {
      this.mainService.ShowLoading();
      const data: IEmployee = this.frmGroup.value;
      data.estado = data.estado ? 1 : 0;

      this.apiService.Create(this.frmGroup.value).subscribe(response => {
        this.mainService.HideLoading();
        if(response) {
          this.dialogService.showSnack('Datos guardados correctamente');
          this.getAll();
          this.reset();
        } else {
          this.dialogService.showSnack('No se pudieron guardar los datos. Intende de nuevo más tarde');
        }
      });
    }
  }

  edit() {
    if(this.validateForm()) {
      const data: IEmployee = this.frmGroup.value;
      data.empleadoId = this.editing.empleadoId;
      data.estado = data.estado ? 1 : 0;

      this.mainService.ShowLoading();
      this.apiService.Update(data).subscribe(response => {
        this.mainService.HideLoading();
        if(response) {
          this.reset();
          this.dialogService.showSnack('Datos editados correctamente');
          this.getAll();
        } else {
          this.dialogService.showSnack('No se pudieron editar los datos. Intende de nuevo más tarde');
        }
      });
    }
  }

  search() {
    let text = this.searchValue;
    if(!text){
      this.FILTERED_TABLEDATA = this.TABLEDATA;
    } else {
      text = text.toLocaleLowerCase();
      this.paginatorOptions.currentPage = 0;
      this.FILTERED_TABLEDATA = this.TABLEDATA.filter(x => 
                                                      this.mainService.ContainsNormalize(x.cedula,text) ||
                                                      this.mainService.ContainsNormalize(x.nombre,text) ||
                                                      this.mainService.ContainsNormalize(x.apellidos,text) ||
                                                      this.mainService.ContainsNormalize(x.correo,text) ||
                                                      x.salario?.toString()?.toLowerCase()?.includes(text) ||
                                                      this.mainService.ContainsNormalize(x.puesto.departamento.descripcion, text) ||
                                                      this.mainService.ContainsNormalize(x.puesto.descripcion, text));
    }
  }

  delete(data: IEmployee) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.empleadoId).subscribe(response => {
          this.mainService.HideLoading();
          if(response) {
            this.dialogService.showSnack('Registro eliminado');
            this.getAll();
          } else {
            this.dialogService.showSnack('No se ha podido eliminar el registro. Intende de nuevo más tarde');
          }
        });
      }
    });
  }

  openEdit(data: IEmployee) {
    const dta = {...data};
    delete dta.empleadoId;
    delete dta.candidato;
    dta['departamento'] = dta.puesto.departamento;
    this.frmGroup.setValue(dta);
    this.frmGroup.controls.departamento.setValue(this.DEPARTMENTS.find(x=> x.departamentoId == data.puesto.departamento.departamentoId));
    this.frmGroup.controls.puesto.setValue(this.POSITIONS.find(x=> x.puestoId == data.puesto.puestoId));
    this.editing = data;
  }

  reset() {
    this.frmGroup.reset();
    this.frmGroup.controls.estado.setValue(true);
    this.editing = null;
  }

  onDepartmentChange() {
    this.POSITIONS = [...this.POSITIONS];
    const department: IDepartment = this.frmGroup.value.departamento;
    if(!department || !this.POSITIONS.find(x=> x.departamento.departamentoId == department.departamentoId)) {
      this.frmGroup.controls.puesto.setValue(null);
      this.frmGroup.controls.puesto.disable();
    } else {
      this.frmGroup.controls.puesto.enable();
    }
  }

}
