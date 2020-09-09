import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { IDepartment } from '../../models/data/i-department';


const URL = {
  GET_ALL: 'department/GetAll',
  CREATE: 'department/create',
  UPDATE: 'department/update',
  DELETE: 'department/delete'
};
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: IDepartment): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(includeInactives: boolean = true): Observable<IDepartment[]> {
      const url = this.hc.GetUrl(URL.GET_ALL, {includeInactives});
      return this.http.get<IDepartment[]>(url);
    }

    Update(data: IDepartment): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

}
