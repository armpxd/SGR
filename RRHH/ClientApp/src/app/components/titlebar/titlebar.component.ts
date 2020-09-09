import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/services/route.service';
import { DialogService } from 'src/app/services/dialog.service';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/data/i-user';
import { Role } from 'src/app/models/enums/role';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  loggedUser: IUser;
  Role = Role;
  constructor(private dialogService: DialogService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.LoggedUser;
  }

  singout() {
    this.dialogService.confirm('¿Seguro que deseas cerrar sesión?').afterClosed().subscribe(response => {
      if (response) {
        this.authService.logout();
      }
    });
  }

}
