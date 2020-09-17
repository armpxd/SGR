import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { UserService } from 'src/app/services/data/user.service';
import { MainService } from 'src/app/services/main.service';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-request-restore-password',
  templateUrl: './request-restore-password.component.html',
  styleUrls: ['./request-restore-password.component.scss']
})
export class RequestRestorePasswordComponent implements OnInit {

  frmGroup = new FormGroup({
    correo: new FormControl(null, [Validators.required])
  });

  constructor(private dialogService: DialogService,
    private userService: UserService,
    private mainService: MainService,
    private routeService: RouteService) { }

  ngOnInit(): void {
  }

  request() {
    this.frmGroup.markAllAsTouched();
    if (this.frmGroup.valid) {
      this.mainService.ShowLoading();
      this.userService.RequestRestorePassword(this.frmGroup.value).subscribe(response => {
        this.mainService.HideLoading();
        if(response) {
          this.routeService.goToRestorePassword(this.frmGroup.value.correo);
        } else {
          this.dialogService.showSnack('No se ha podido solicitar el restablecimiento de su contraseña. Es posible que su cuenta no exista o esté inactiva.', 8000);
        }
      });
    } else {
      this.dialogService.showSnack('Favor introducir los datos correctamente');
    }
  }
}
