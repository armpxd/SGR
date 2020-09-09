import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { IPosition } from '../../models/data/i-position';

const URL = {
  GET_ALL: 'position/GetAll',
  GET_BY_DEPARTMENT: 'position/GetByDepartment',
  CREATE: 'position/create',
  UPDATE: 'position/update',
  DELETE: 'position/delete'
};
@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: IPosition): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(includeInactives: boolean = true): Observable<IPosition[]> {
      const url = this.hc.GetUrl(URL.GET_ALL, {includeInactives});
      return this.http.get<IPosition[]>(url);
    }

    GetByDepartment(departmentId: number) : Observable<IPosition[]>{
      const url = this.hc.GetUrl(URL.GET_BY_DEPARTMENT, {departmentId});
      return this.http.get<IPosition[]>(url);
    }

    Update(data: IPosition): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

}
