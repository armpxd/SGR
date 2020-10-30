import { Injectable } from '@angular/core';
import { HttpCommonService} from './http-common.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IKeyValue } from '../models/i-key-value';


const URL = {
  GET_LANGUAGES: 'webservice/language/getall'
};
@Injectable({
  providedIn: 'root'
})
export class WebService {

  constructor(private hc: HttpCommonService, private http: HttpClient) { }

  getLanguages(): Observable<IKeyValue[]> {
    const url = this.hc.GetUrl(URL.GET_LANGUAGES);
    return this.http.get<IKeyValue[]>(url);
  }
}
