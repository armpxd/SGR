import { Component, OnInit } from '@angular/core';
import { PositionService } from '../../../services/data/position.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IPosition } from 'src/app/models/data/i-position';
import { NivelRiesgo } from 'src/app/models/enums/nivel-riesgo';
import { DepartmentService } from 'src/app/services/data/department.service';
import { IDepartment } from 'src/app/models/data/i-department';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {

  TABLEDATA: IPosition[] = [];
  FILTERED_TABLEDATA: IPosition[] = [];
  DEPARTMENTS: IDepartment[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: IPosition = null;
  NivelRiesgo = NivelRiesgo;

  frmGroup = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    departamento: new FormControl(null, [Validators.required]),
    nivelDeRiesgo: new FormControl(0, [Validators.required]),
    salarioMinimo: new FormControl(0, [Validators.min(0)]),
    salarioMaximo: new FormControl(0, [Validators.min(0)]),
    estado: new FormControl(true),

  });

  constructor(private apiService: PositionService,
              private dialogService: DialogService,
              private mainService: MainService,
              private departmentService: DepartmentService) { }

  ngOnInit(): void {
    this.getAll();
    this.getDepartments();
  }

  getAll() {
    this.mainService.ShowLoading();
    this.apiService.GetAll().subscribe(response => {
      this.mainService.HideLoading();
      this.TABLEDATA = this.FILTERED_TABLEDATA = response;
    });
  }

  getDepartments() {
    this.mainService.ShowLoading();
    this.departmentService.GetAll(false).subscribe(response => {
      this.DEPARTMENTS = response;
      this.mainService.HideLoading();
    });
  }

  validateForm(): boolean {
    this.frmGroup.markAllAsTouched();
    const valid = this.frmGroup.valid;
    if(!valid) {
      this.dialogService.showSnack('Algunos campos son inválidos. Favor verificar');
    }

    if(this.frmGroup.controls.salarioMinimo.value > this.frmGroup.controls.salarioMaximo.value) {
      this.dialogService.showSnack('El salario minimo no puede ser mayor al salario máximo para este puesto', 5000);
      return false;
    }
    return valid;
  }

  save() {
    if(this.validateForm()) {
      this.mainService.ShowLoading();
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
      const data: IPosition = this.frmGroup.value;
      data.puestoId = this.editing.puestoId;

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
      this.FILTERED_TABLEDATA = this.TABLEDATA.filter(x => x.descripcion?.toLowerCase()?.includes(text) ||
                                                            x.salarioMaximo?.toString()?.includes(text) ||
                                                            x.salarioMinimo?.toString()?.includes(text));
    }
  }

  delete(data: IPosition) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.puestoId).subscribe(response => {
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

  openEdit(data: IPosition) {
    const dta = {...data};
    delete dta.puestoId;
    this.frmGroup.setValue(dta);
    this.frmGroup.controls.departamento.setValue(this.DEPARTMENTS.find(x=> x.departamentoId == data.departamento.departamentoId));

    this.editing = data;
  }

  reset() {
    this.frmGroup.reset();
    this.frmGroup.controls.estado.setValue(true);
    this.editing = null;
  }
}
