import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../../services/data/skill.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ISkill } from 'src/app/models/data/i-skill';
import { State } from 'src/app/models/enums/state';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  TABLEDATA: ISkill[] = [];
  FILTERED_TABLEDATA: ISkill[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: ISkill = null;

  frmGroup = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    estado: new FormControl(State.Activo)
  });

  constructor(private apiService: SkillService,
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
      const data: ISkill = this.frmGroup.value;
      data.estado = data.estado ? 1 : 0;
      
      this.apiService.Create(data).subscribe(response => {
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
      const data: ISkill = this.frmGroup.value;
      data.competenciaId = this.editing.competenciaId;
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
      this.FILTERED_TABLEDATA = this.TABLEDATA.filter(x => this.mainService.ContainsNormalize(x.descripcion, text))
    }
  }

  delete(data: ISkill) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.competenciaId).subscribe(response => {
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

  openEdit(data: ISkill) {
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
