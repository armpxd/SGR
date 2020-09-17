import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Role } from '../models/enums/role';
import { RouteService } from '../services/route.service';
import { DialogService } from '../services/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class AspirantRoleGuard implements CanActivate {

  constructor(private authService: AuthService, 
              private routeService: RouteService,
              private dialogService: DialogService
    ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const user = this.authService.LoggedUser;
      if(user.role == Role.Guest) {
        return true;
      }

      this.dialogService.showSnack('No tienes acceso a estos recursos.');
      this.routeService.goHome();
      return false;
  }
  
}
