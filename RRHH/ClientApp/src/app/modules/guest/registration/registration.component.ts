import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IRegistration } from '../../../models/data/i-registration';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/data/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  frmGroup = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null),
    cedula: new FormControl(null, [Validators.required, Validators.minLength(11)]),
    telefono: new FormControl(null, [Validators.required, Validators.minLength(10)]),
    correo: new FormControl(null, [Validators.required,Validators.email]),
    repetirCorreo: new FormControl(null, [Validators.required,Validators.email]),
    clave: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    repetirClave: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  });

  constructor(private dialogService: DialogService,
              private mainService: MainService,
              private userService: UserService,
              private routeService: RouteService) { }

  ngOnInit(): void {

  }

  validateForm() {
    this.frmGroup.markAllAsTouched();
    if(this.frmGroup.invalid) {
      this.dialogService.showSnack('Algunos campos son inválidos. Favor verificar');
      return false;
    }

    const frm: IRegistration = this.frmGroup.value;
    if(frm.correo != frm.repetirCorreo) {
      this.dialogService.showSnack('Los correos no coinciden');
      return false;
    }

    if(frm.clave != frm.repetirClave) {
      this.dialogService.showSnack('Las contraseñas no coinciden');
      return false;
    }
    
    if(!this.mainService.ValidateCedula(frm.cedula)) {
      this.dialogService.showSnack('El número de cédula es inválido');
      return false;
    }

    return true;
  }

  save() {
    if(this.validateForm()) {
      this.mainService.ShowLoading();
      const data: IRegistration = this.frmGroup.value;
      this.userService.CreateAspirant(data).subscribe(response=> {
        this.mainService.HideLoading();
        if(response) {
          this.routeService.goToUserCreated(data.correo);
        } else {
          this.dialogService.showSnack('Usuario no creado. Es posible que ya existe un usuario con sus datos. Valide los datos digitados.', 6000);
        }
      });
    }
  }

}
