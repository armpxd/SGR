import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../services/data/language.service';
import { ILanguage } from 'src/app/models/data/i-language';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  TABLEDATA: ILanguage[] = [];
  FILTERED_TABLEDATA: ILanguage[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: ILanguage = null;

  frmGroup = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    estado: new FormControl(true)
  });

  constructor(private apiService: LanguageService,
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
      const data: ILanguage = this.frmGroup.value;
      data.idiomaId = this.editing.idiomaId;

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

  delete(lang: ILanguage) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(lang.idiomaId).subscribe(response => {
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

  openEdit(lang: ILanguage) {
    const g = this.frmGroup.controls;
    g.descripcion.setValue(lang.descripcion);
    g.estado.setValue(lang.estado);
    this.editing = lang;
  }

  reset() {
    this.frmGroup.reset();
    this.frmGroup.controls.estado.setValue(true);
    this.editing = null;
  }
}
