import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { IUser } from '../../models/data/i-user';
import { IRegistration } from 'src/app/models/i-registration';


const URL = {
  GET_ALL: 'user/GetAll',
  CREATE: 'user/create',
  CREATE_ASPIRANT: 'user/CreateAspirant',
  UPDATE: 'user/update',
  DELETE: 'user/delete',
  ACTIVATE_ACCOUNT: 'user/ActivateAccount'
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: IUser): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    CreateAspirant(data: IRegistration): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE_ASPIRANT);
      return this.http.post<boolean>(url, data);
    }

    GetAll(): Observable<IUser[]> {
      const url = this.hc.GetUrl(URL.GET_ALL);
      return this.http.get<IUser[]>(url);
    }

    Update(data: IUser): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

    ActivateAccount(data): Observable<boolean> {
      const url = this.hc.GetUrl(URL.ACTIVATE_ACCOUNT, data);
      return this.http.get<boolean>(url);
    }

}
