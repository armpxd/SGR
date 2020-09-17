import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/data/user.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/data/i-user';
import { Role } from 'src/app/models/enums/role';
import { State } from 'src/app/models/enums/state';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  TABLEDATA: IUser[] = [];
  FILTERED_TABLEDATA: IUser[] = [];
  paginatorOptions = { itemsPerPage: 5, currentPage: 0}

  searchValue = '';
  editing: IUser = null;
  Role = Role;

  frmGroup = new FormGroup({
    nombreUsuario: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    clave: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    nombre: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null),
    correo: new FormControl(null, [Validators.required, Validators.email]),
    role: new FormControl(null, [Validators.required]),
    estado: new FormControl(State.Activo),
    cedula: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    telefono: new FormControl(null, [Validators.required]),
  });

  constructor(private apiService: UserService,
              private dialogService: DialogService,
              private mainService: MainService) { }

  ngOnInit(): void {
    this.getAll();
    this.Role.Guest
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
    if(!this.frmGroup.valid) {
      this.dialogService.showSnack('Algunos campos son inválidos. Favor verificar');
      return false;
    }
    
    const data: IUser = this.frmGroup.value;

    if (!this.mainService.ValidateCedula(data.cedula)) {
      this.dialogService.showSnack('El número de cédula es inválido');
      return false;
    }

    if (data.clave && !this.mainService.ValidatePassword(data.clave)) {
      this.dialogService.showSnack('La contraseña debe tener por lo menos 6 caracteres.');
      return false;
    }

    return true;
  }

  save() {
    if(this.validateForm()) {
      this.mainService.ShowLoading();
      const data: IUser = this.frmGroup.value;
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
      const data: IUser = this.frmGroup.value;
      data.usuarioId = this.editing.usuarioId;
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
      this.FILTERED_TABLEDATA = this.TABLEDATA.filter(x => x.nombreUsuario?.toLowerCase()?.includes(text) ||
                                                            x.nombre?.toLowerCase()?.includes(text) ||
                                                            x.apellidos?.toLowerCase()?.includes(text) ||
                                                            x.correo?.toLowerCase()?.includes(text) ||
                                                            x.telefono?.toLowerCase()?.includes(text) ||
                                                            x.cedula?.toLowerCase()?.includes(text));
    }
  }

  delete(data: IUser) {
    this.dialogService.confirm('¿Eliminar este registro?').afterClosed().subscribe(x=> {
      if(x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.usuarioId).subscribe(response => {
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
 
  openEdit(data: IUser) {
    const dta = {...data};
    //dta.estado = dta.estado == State.Activo ? true : false;
    delete dta.usuarioId;
    dta['clave'] = null;
    this.frmGroup.setValue(dta);
    this.frmGroup.controls.clave.clearValidators();
    this.frmGroup.controls.clave.updateValueAndValidity();
    this.editing = data;
  }

  reset() {
    this.frmGroup.reset();
    this.frmGroup.controls.estado.setValue(State.Activo);
    this.editing = null;
    this.frmGroup.controls.clave.setValidators([Validators.minLength(6), Validators.required]);
    this.frmGroup.controls.clave.updateValueAndValidity();
  }

}
