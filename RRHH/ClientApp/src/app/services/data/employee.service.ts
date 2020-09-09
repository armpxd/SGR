import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { IEmployee } from '../../models/data/i-employee';


const URL = {
  GET_ALL: 'employee/GetAll',
  CREATE: 'employee/create',
  UPDATE: 'employee/update',
  DELETE: 'employee/delete'
};
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: IEmployee): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(): Observable<IEmployee[]> {
      const url = this.hc.GetUrl(URL.GET_ALL);
      return this.http.get<IEmployee[]>(url);
    }

    Update(data: IEmployee): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

}
