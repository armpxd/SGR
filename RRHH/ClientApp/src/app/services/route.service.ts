import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private router: Router) { }

  private goPage(page: string) {
    this.router.navigateByUrl(page);
  }

  goLogin() {
    this.goPage('/login');
  }

  goHome() {
    this.goPage('/inicio');
  }

  goRegistration() {
    this.goPage('/invitado/registro');
  }

  goToUserCreated(email?: string) {
    if(email) {
      this.goPage('/invitado/usuariocreado?email=' + email);
    } else{
      this.goPage('/invitado/usuariocreado');
    }
  }

  
}
