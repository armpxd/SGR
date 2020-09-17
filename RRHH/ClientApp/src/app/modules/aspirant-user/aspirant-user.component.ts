import { Component, OnInit } from '@angular/core';
import { IAspirant } from 'src/app/models/data/i-aspirant';
import { AspirantService } from 'src/app/services/data/aspirant.service';
import { IUser } from 'src/app/models/data/i-user';
import { AuthService } from 'src/app/services/auth.service';
import { MainService } from 'src/app/services/main.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-aspirant-user',
  templateUrl: './aspirant-user.component.html',
  styleUrls: ['./aspirant-user.component.scss']
})
export class AspirantUserComponent implements OnInit {

  data: IAspirant;
  loggedUser: IUser;
  get isEdit(): boolean {
    return this.data.candidatoId > 0;
  }

  constructor(private aspirantService: AspirantService,
              private mainService: MainService,
              private authService: AuthService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.LoggedUser;
    this.getData();
  }

  getData() {
    this.mainService.ShowLoading();
    this.aspirantService.GetByUser(this.loggedUser.usuarioId).subscribe(response => {
      this.mainService.HideLoading();
      this.data = response;
    });
  }

  validateData(): boolean {
    return true;
  }

  onInformationChange(event: IAspirant) {
    if(event.candidatoId > 0) {
      this.edit(event);
    } else {
      this.create(event);
    }
  }

  create(data: IAspirant) {
    if(this.validateData()) {
      this.mainService.ShowLoading();
      this.aspirantService.Create(data).subscribe(response => {
        this.mainService.HideLoading();
        if (response) {this.getData();
          this.dialogService.showSnack('Datos guardados correctamente');
        } else {
          this.dialogService.showSnack('No se han podido guardar los datos');
        }
      });
    }
  }

  edit(data: IAspirant) {
    if(this.validateData()) {
      this.mainService.ShowLoading();
      this.aspirantService.Update(data).subscribe(response => {
        this.mainService.HideLoading();
        if (response) {this.getData();
          this.dialogService.showSnack('Datos guardados correctamente');
        } else {
          this.dialogService.showSnack('No se han podido guardar los datos');
        }
      });
    }
  }
}
