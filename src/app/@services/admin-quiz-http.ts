import { Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminQuizHttp {
  private readonly baseUrl = 'http://localhost:8080/quiz';

  constructor(private http:HttpClient) { }

  // inherit quiz-http methods
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


  // new methods
  create(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  update(data: any): Observable<any>{
    return this.http.post(`${this.baseUrl}/update`, data);
  }

  delete(quizId: number): Observable<any>{
    const params = new HttpParams().set('quizId', quizId.toString());
    return this.http.get(`${this.baseUrl}/delete`, { params });
  }


}
