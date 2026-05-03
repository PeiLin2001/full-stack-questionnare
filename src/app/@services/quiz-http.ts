import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizHttp {

  private readonly baseUrl = 'http://localhost:8080/quiz';

  constructor(private http:HttpClient) { }

  getQuizList(isFrontend: boolean): Observable<any>{
    const params = new HttpParams().set('isFrontend', isFrontend.toString());
    return this.http.get(`${this.baseUrl}/get_quiz_list`, { params });
  }

  getQuestionsByQuizId(quizId: number): Observable<any>{
    const params = new HttpParams().set('quizId', quizId.toString());
    return this.http.get(`${this.baseUrl}/get_question_list`, { params });
  }

  getQuizById(quizId: number): Observable<any>{
    const params = new HttpParams().set('quizId', quizId.toString());
    return this.http.get(`${this.baseUrl}/get_quiz_information`, { params });
  }

}
