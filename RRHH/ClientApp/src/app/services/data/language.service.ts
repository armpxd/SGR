import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpCommonService} from '../http-common.service';
import { Observable } from 'rxjs';
import { ILanguage } from '../../models/data/i-language';
import { IKeyValue } from 'src/app/models/i-key-value';


const URL = {
  GET_ALL: 'language/GetAll',
  CREATE: 'language/create',
  UPDATE: 'language/update',
  DELETE: 'language/delete',
  SAVE_LANGUAGES_TO_DB: 'language/savetodb'
};
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http: HttpClient,
              private hc: HttpCommonService) { }

    Create(data: ILanguage): Observable<boolean> {
      const url = this.hc.GetUrl(URL.CREATE);
      return this.http.post<boolean>(url, data);
    }

    GetAll(includeInactives: boolean = true): Observable<ILanguage[]> {
      const url = this.hc.GetUrl(URL.GET_ALL, { includeInactives });
      return this.http.get<ILanguage[]>(url);
    }

    Update(data: ILanguage): Observable<boolean> {
      const url = this.hc.GetUrl(URL.UPDATE);
      return this.http.put<boolean>(url, data);
    }

    Delete(dataId: number): Observable<boolean> {
      const url = this.hc.GetUrl(URL.DELETE, {id: dataId});
      return this.http.delete<boolean>(url);
    }

    saveLanguagesToDataBase(languages: IKeyValue[]): Observable<boolean> {
      const url = this.hc.GetUrl(URL.SAVE_LANGUAGES_TO_DB);
      return this.http.post<boolean>(url, languages);
    }

}
