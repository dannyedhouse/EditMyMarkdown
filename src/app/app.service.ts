import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  private url = "https://api.github.com/emojis";

  getEmojis(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}

export interface Emoji {
  name: string;
  url: string;
  active: boolean;
}