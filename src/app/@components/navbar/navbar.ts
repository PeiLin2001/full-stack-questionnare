import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttp } from './../../@services/user-http';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  constructor(
      private userService:UserHttp,
      private router: Router
    ){}

  //get name
  get name(): string {
    return this.userService.getUserName();
  }

  isLogIn(): boolean{
    return this.userService.isLoggedIn();
  }

  goToSigninPage(){
    this.router.navigate(['/sign-in'])
  }

  goToRegister(){
    this.router.navigate(['/register'])
  }

  goToHomePage(){
    this.router.navigate(['/home'])
  }
}
