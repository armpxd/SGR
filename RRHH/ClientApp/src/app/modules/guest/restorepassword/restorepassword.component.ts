import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/data/user.service';
import { MainService } from 'src/app/services/main.service';
import { RouteService } from 'src/app/services/route.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restorepassword',
  templateUrl: './restorepassword.component.html',
  styleUrls: ['./restorepassword.component.scss']
})
export class RestorepasswordComponent implements OnInit {

  frmGroup = new FormGroup({
    correo: new FormControl(null, [Validators.required]),
    token: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
    clave: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
    repetirClave: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(30)]),
  });

  constructor(private dialogService: DialogService,
              private userService: UserService,
              private mainService: MainService,
              private routeService: RouteService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const email = params['email'];
      if(email) {
        this.frmGroup.controls.correo.setValue(email);
      }
      const token = params['token'];
      if(token) {
        this.frmGroup.controls.token.setValue(token);
      }

  });
  }

  validateForm() {
    this.frmGroup.markAllAsTouched();
    if(this.frmGroup.invalid) {
      this.dialogService.showSnack('Favor introducir los datos correctamente');
      return false;
    }

    const data = this.frmGroup.value;
    if(data.clave != data.repetirClave) {
      this.dialogService.showSnack('Las contraseñas no coinciden');
      return false;
    }

    return true;
  }

  restore() {
    this.frmGroup.markAllAsTouched();
    if (this.validateForm()) {
      this.mainService.ShowLoading();
      this.userService.RestorePassword(this.frmGroup.value).subscribe(response => {
        this.mainService.HideLoading();
        if(response) {
          this.dialogService.showSnack('Contraseña cambiada correctamente. Redireccionando al login', 3000);
          setTimeout(()=> {
            this.routeService.goLogin();
          }, 3000);
        } else {
          this.dialogService.showSnack('No se ha podido areestablecer la contraseña. Es posible que el código de verificación haya espirado', 7000);
        }
      });
    }
  }

}
