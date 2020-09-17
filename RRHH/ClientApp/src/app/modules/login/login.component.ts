import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from '../../services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../services/main.service';
import { RouteService } from '../../services/route.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  frmGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })
  returnUrl: string;

  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private mainService: MainService,
              private routeService: RouteService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.routeService.goHome();
    }

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  singin() {
    this.frmGroup.markAllAsTouched();
    if (this.frmGroup.invalid) {
      this.dialogService.showSnack('Usuario y/o contraseña incorrectos');
      return;
    }

    const username = this.frmGroup.controls.username.value;
    const password = this.frmGroup.controls.password.value;

    this.mainService.ShowLoading();
    this.authService.singin(username, password).subscribe(response => {
      
      this.mainService.HideLoading();
      if (response) {
        this.authService.setSessionToken(response);
        this.router.navigate([this.returnUrl]);
      } else {
        this.dialogService.showSnack('Usuario y/o contraseña incorrectos');
      }
    });
    
  }

  singup() {
    this.routeService.goRegistration();
  }

}
