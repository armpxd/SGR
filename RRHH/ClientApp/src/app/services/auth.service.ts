import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from './http-common.service';
import { IUser } from '../models/data/i-user';
import { RouteService } from './route.service';

const URL = {
  SINGIN: 'account/singin',
  SINGUP: 'account/singup',
  VALIDATE_SESSION: 'account/validate'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly tokenName = 'Authorization';

  constructor(private storageService: StorageService, 
              private http: HttpClient,
              private hc: HttpCommonService,
              private routeService: RouteService) { }

  get LoggedUser(): IUser {
    const token = this.getSessionToken();
    if(token) {
      const ut = token.split('.')[1];
      const user: IUser = JSON.parse(atob(ut));
      return user;
    } else {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const user = this.LoggedUser;
    return user != null;
  }

  getSessionToken(): string {
    const token = this.storageService.Get(this.tokenName);
    return token;
  }

  setSessionToken(token: string) {
    this.storageService.Set(this.tokenName, token);
  }

  singin(username: string, password: string): Observable<string> {
    const url = this.hc.GetUrl(URL.SINGIN);
    const data = {
      Username: username,
      Password: password
    };
    return this.http.post<string>(url, data);
  }

  logout() {
    this.storageService.Remove(this.tokenName);
    this.routeService.goLogin();
  }

  validate(): Observable<boolean> {
    const url = this.hc.GetUrl(URL.VALIDATE_SESSION);
    return this.http.get<boolean>(url);
  }
}
