import { UserHttp } from './../../@services/user-http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  // Declare
  account:string = '';
  password:string = '';
  reminder:string = '';
  count:number = 0;
  accErrMsg:string = '';
  pwdErrMsg:string = '';

  constructor(
    private userService:UserHttp,
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
    this.userService.logIn(this.account, this.password).subscribe({
      next: (res:any) => {
        if(res.stateCode === 200)
        {
          console.log("Successful");

          // 用sessionStorage維持登入狀態
          sessionStorage.setItem('userToken', 'login_success');

          // 再次訂閱getUserInfo
          this.userService.getUserInfo(this.account).subscribe({
            next: (userRes: any) => {
              if(userRes.stateCode === 200)
              {
                console.log('Get information successfully!');
                sessionStorage.setItem('userName', userRes.user.name);
                sessionStorage.setItem('userEmail',userRes.user.email)
              }
              else
              {
                // 用email充當名字
                console.log('Fail to get information.');
                const displayName = this.account.split('@')[0];
                sessionStorage.setItem('userName', displayName);

              }
              // 全部資料都拿到了才跳轉頁面!(注意: 由於 subscribe 非同步的特性，
              // navigate 不能放到 subscribe 外，否則會先跳轉再拿資料)
              this.router.navigate(['/quizlist'])
            },
            error: (userRes: any) =>
            {
              sessionStorage.setItem('userName', 'Honey♥');

              // 全部資料都拿到了才跳轉頁面!
              this.router.navigate(['/quizlist'])
            }
          });
        }
        else
        {
          console.error(res.message);
          this.handleError();
        }
      },
      error: (res: any) => {
          console.error('Unexpected error!');
          let message = '';

          if (res.status === 0) {
            message = 'Unable to connect to server. Please try again later.';
          }
          else if (res.status === 404) {
            message = 'API endpoint not found.';
          }
          else if (res.status === 500) {
            message = 'Internal server error.';
          }
          else {
            message = 'An unexpected error occurred.';
          }

          alert(message);
          this.handleError();
      }
    });
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
