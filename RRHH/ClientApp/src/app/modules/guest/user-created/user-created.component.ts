import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/data/user.service';
import { MainService } from 'src/app/services/main.service';
import { RouteService } from 'src/app/services/route.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-created',
  templateUrl: './user-created.component.html',
  styleUrls: ['./user-created.component.scss']
})
export class UserCreatedComponent implements OnInit {

  frmGroup = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    token: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)])
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
        this.frmGroup.controls.email.setValue(email);
      }
      const token = params['token'];
      if(token) {
        this.frmGroup.controls.token.setValue(token);
      }

      if(email && token) {
        this.confirm();
      }
  });
  }

  confirm() {
    this.frmGroup.markAllAsTouched();
    if (this.frmGroup.valid) {
      this.mainService.ShowLoading();
      this.userService.ActivateAccount(this.frmGroup.value).subscribe(response => {
        this.mainService.HideLoading();
        if(response) {
          this.dialogService.showSnack('Cuenta activada. Redireccionando al login', 3000);
          setTimeout(()=> {
            this.routeService.goLogin();
          }, 3000);
        } else {
          this.dialogService.showSnack('No se ha podido activar su cuenta. Es posible que su cuenta no exista o que el código de activación haya expirado.', 7000);
        }
      });
    } else {
      this.dialogService.showSnack('Favor introducir los datos correctamente');
    }
  }
}
