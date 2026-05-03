import { User } from './../@interfaces/user';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserHttp {

  // Passing in http as a member of the userservice class
  constructor(private http:HttpClient) { }
  private readonly baseUrl = 'http://localhost:8080/user';

  // logIn(email: string, password: string) {
  //   const params = new HttpParams()
  //     .set('email', email)
  //     .set('password', password);

  //   return this.http.get(`${this.baseUrl}/login`, { params });
  // }

  // logIn(email: string, password: string): Observable<User> {
  //   const params = new HttpParams()
  //     .set('email', email)
  //     .set('password', password);

  //   return this.http.get<User>(`${this.baseUrl}/login`, { params });
  // }

  logIn(email: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.get<User>(`${this.baseUrl}/login`, { params });
  }


  register(user: User){
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  isLoggedIn(): boolean{
    const token = sessionStorage.getItem('userToken');
    return token !== null;
  }

  getUserInfo(email:string): Observable<any>{
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(`${this.baseUrl}/getInfo`, { params });
  }

  getUserName(): string {
    return sessionStorage.getItem('userName') || 'User';
  }

  getUserEmail(): string{
    return sessionStorage.getItem('userEmail') || 'User';
  }

}
