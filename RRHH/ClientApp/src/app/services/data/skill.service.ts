import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { ISkill } from '../../models/data/i-skill';


const URL = {
  GET_ALL: 'skill/GetAll',
  CREATE: 'skill/create',
  UPDATE: 'skill/update',
  DELETE: 'skill/delete'
};
@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: ISkill): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(includeInactives: boolean = true): Observable<ISkill[]> {
      const url = this.hc.GetUrl(URL.GET_ALL, {includeInactives});
      return this.http.get<ISkill[]>(url);
    }

    Update(data: ISkill): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

}
