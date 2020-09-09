import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class HttpCommonService {

  constructor() { }

  public GetUrl(path: string, param: any = null) {
    const baseUrl = environment.baseURL.endsWith('/') ? environment.baseURL : environment.baseURL + (path.startsWith('/') ? '' : '/');
    let url = baseUrl + path;

    if(param) {
      url += '?' + Object.entries(param).map(([key, val]) => `${key}=${encodeURIComponent(val.toString())}`).join('&');
    }

    return url;
  }
}
