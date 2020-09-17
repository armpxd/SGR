import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService } from '../http-common.service';
import { IAspirant } from 'src/app/models/data/i-aspirant';
import { Observable } from 'rxjs';

const URL = {
  GET_ALL: 'aspirant/GetAll',
  GET: 'aspirant/get',
  GET_BY_USER: 'aspirant/getbyuser',
  CREATE: 'aspirant/create',
  UPDATE: 'aspirant/update',
  DELETE: 'aspirant/delete',
  HIRE: 'aspirant/hire'
};
@Injectable({
  providedIn: 'root'
})
export class AspirantService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: IAspirant): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    Get(id: number): Observable<IAspirant> {
      const url = this.hc.GetUrl(URL.GET, {id});
      return this.http.get<IAspirant>(url);
    }

    GetByUser(userId: number): Observable<IAspirant> {
      const url = this.hc.GetUrl(URL.GET_BY_USER, {userId});
      return this.http.get<IAspirant>(url);
    }

    GetAll(): Observable<IAspirant[]> {
      const url = this.hc.GetUrl(URL.GET_ALL);
      return this.http.get<IAspirant[]>(url);
    }

    Update(data: IAspirant): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

    Hire(data): Observable<boolean> {
      const url = this.hc.GetUrl(URL.HIRE);
      return this.http.post<boolean>(url, data);
    }

}
