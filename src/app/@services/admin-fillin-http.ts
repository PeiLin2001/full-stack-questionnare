import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AdminFillinHttp {
  private readonly baseUrl = 'http://localhost:8080/quiz';

  constructor(private http:HttpClient) { }

  // inherit fillin-http methods
  fillin(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/fillin`, data);
  }

  // new methods
  getFeedback(quizId: number): Observable<any>{
    const params = new HttpParams().set('quizId', quizId.toString());
    return this.http.post(`${this.baseUrl}/feedback`, { params });
  }

  statisticData(quizId: number): Observable<any>{
    const params = new HttpParams().set('quizId', quizId.toString());
    return this.http.post(`${this.baseUrl}/statistics`, { params });
  }

}
