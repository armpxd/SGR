import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';

const URL = {
  GET_NEW_EMPLOYEE_REPORT: 'report/GetNewEmployee'
};
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    GetNewEmployee(data: any): Observable<any[]> {
      const url = this.hc.GetUrl(URL.GET_NEW_EMPLOYEE_REPORT);
      return this.http.post<any[]>(url, data);
    }
}
