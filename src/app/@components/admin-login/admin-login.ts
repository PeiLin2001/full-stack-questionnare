import { UserHttp } from './../../@services/user-http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {  // Declare
  account:string = '';
  password:string = '';
  reminder:string = '';
  count:number = 0;
  accErrMsg:string = '';
  pwdErrMsg:string = '';

  constructor(
    private userhttp:UserHttp,
    private router: Router
  ){}

  //Check the eligibility of login
  logIn(){
    // Error cannot be more than 3 times
    if(this.count >= 3)
    {
      return;
    }

    // Check if the parameter is null or blank
    if(!this.account)
    {
      this.accErrMsg = 'Please input your account!';
    }
    else
    {
      this.accErrMsg = '';
    }

    if(!this.password)
    {
      this.pwdErrMsg = 'Please input your password!';
    }
    else
    {
      this.pwdErrMsg = '';
    }


    // Check if this account doesn't exist
    // Check if the password is wrong

    if(this.account === 'admin' && this.password === '1234')
    {
      this.router.navigate(['/adminconsole'])
      alert("Successful!");
    }
    else
    {
      this.handleError();
    }
  } // The end of logIn

  private handleError(){
    this.count ++;
    if(this.count < 3)
    {
      this.reminder = `Account or password error! Remain ${3-this.count} times!` ;
    }
    else
    {
      this.reminder = `Too many errors! The account has been locked.`;
    }
  } // The end of handleError


}// The end of the component
