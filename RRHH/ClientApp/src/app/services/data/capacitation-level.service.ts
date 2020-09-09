import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { ICapacitationLevel } from '../../models/data/i-capacitation-level';

const URL = {
  GET_ALL: 'CapacitationLevel/GetAll',
  CREATE: 'CapacitationLevel/create',
  UPDATE: 'CapacitationLevel/update',
  DELETE: 'CapacitationLevel/delete'
};
@Injectable({
  providedIn: 'root'
})
export class CapacitationLevelService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: ICapacitationLevel): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(): Observable<ICapacitationLevel[]> {
      const url = this.hc.GetUrl(URL.GET_ALL);
      return this.http.get<ICapacitationLevel[]>(url);
    }

    Update(data: ICapacitationLevel): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

}
