import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/models/data/i-user';
import { Role } from 'src/app/models/enums/role';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  loggedUser: IUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.LoggedUser;
  }

  canShow(): boolean {
    return this.loggedUser.role == Role.RRHH;
  }

}
