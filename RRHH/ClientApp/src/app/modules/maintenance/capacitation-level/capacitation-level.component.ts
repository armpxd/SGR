import { Component, OnInit } from '@angular/core';
import { CapacitationLevelService } from '../../../services/data/capacitation-level.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ICapacitationLevel } from 'src/app/models/data/i-capacitation-level';


@Component({
  selector: 'app-capacitation-level',
  templateUrl: './capacitation-level.component.html',
  styleUrls: ['./capacitation-level.component.scss']
})
export class CapacitationLevelComponent implements OnInit {

  TABLEDATA: ICapacitationLevel[] = [];
  FILTERED_TABLEDATA: ICapacitationLevel[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: ICapacitationLevel = null;

  frmGroup = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    estado: new FormControl(true)
  });

  constructor(private apiService: CapacitationLevelService,
              private dialogService: DialogService,
              private mainService: MainService) { }

  ngOnInit(): void {
    
    this.getAll();
  }

  getAll() {
    this.mainService.ShowLoading();
    this.apiService.GetAll().subscribe(response => {
      this.mainService.HideLoading();
      this.TABLEDATA = this.FILTERED_TABLEDATA = response;
    });
  }

  validateForm(): boolean {
    this.frmGroup.markAllAsTouched();
    const valid = this.frmGroup.valid;
    if(!valid) {
      this.dialogService.showSnack('Algunos campos son inválidos. Favor verificar.');
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
      const data: ICapacitationLevel = this.frmGroup.value;
      data.nivelCapacitacionId = this.editing.nivelCapacitacionId;

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
      this.FILTERED_TABLEDATA = this.TABLEDATA.filter(x => x.descripcion?.toLowerCase()?.includes(text))
    }
  }

  delete(data: ICapacitationLevel) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.nivelCapacitacionId).subscribe(response => {
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

  openEdit(data: ICapacitationLevel) {
    const g = this.frmGroup.controls;
    g.descripcion.setValue(data.descripcion);
    g.estado.setValue(data.estado);
    this.editing = data;
  }

  reset() {
    this.frmGroup.reset();
    this.frmGroup.controls.estado.setValue(true);
    this.editing = null;
  }

}
