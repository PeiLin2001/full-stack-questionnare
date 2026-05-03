import { User } from './../../@interfaces/user';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { UserHttp } from '../../@services/user-http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit{

  constructor(
    private userhttp:UserHttp,
    private router: Router){}

  // Declare an array to save age options
  ageOptions:number[] = [];

  ngOnInit() {
    // 組件初始化時，在 HTML select options 生成 0-130 的數字
    this.generateAgeOptions();
  }

  // HTML select options
  generateAgeOptions(){
    for(let i = 0; i < 130; i++)
    {
      this.ageOptions.push(i + 1);
    }
  }

  // To create an account
  user = {} as User;

  createAccount(){
    // Check if the param is null

    this.userhttp.register(this.user).subscribe({
      next: (res:any) => {
        console.log('Sending user:', this.user);
        console.log(res);
        if(res.stateCode === 200)
        {
          alert('Create an account successfully!')
          // navigate
          this.router.navigate(['/quizlist'])
        }
        else
        {
          console.log(res);

        }
      },
      error: (res:any) =>{
        console.log('HTTp error: ' ,res);
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
      }
    }


    )
  }

}
