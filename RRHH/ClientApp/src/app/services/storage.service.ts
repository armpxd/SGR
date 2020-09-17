import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private webStorage: Storage;

  constructor() {
    this.webStorage = sessionStorage;
  }

  public Set(key: string, value: any): void {
    this.webStorage.setItem(key, value);
  }
  public SetObject(key: string, value: any): void {
    const va = JSON.stringify(value);
    this.webStorage.setItem(key, va);
  }
  public Get(key: string): string {
    const data = this.webStorage.getItem(key);
    return data;
  }
  public GetObject(key: string) {
    const va = this.webStorage.getItem(key);
    const value = va != null ? JSON.parse(va) : null;
    return va;
  }
  public Remove(key: string): void {
    this.webStorage.removeItem(key);
  }
  public Clear(): void {
    this.webStorage.clear();
  }
}
