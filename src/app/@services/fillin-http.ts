import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FillinHttp {
  private readonly baseUrl = 'http://localhost:8080/quiz';

  constructor(private http:HttpClient) {}

  fillin(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/fillin`, data);
  }

}
