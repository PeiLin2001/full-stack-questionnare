import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-reminder',
  imports: [],
  templateUrl: './start-reminder.html',
  styleUrl: './start-reminder.scss',
})
export class StartReminder {
  constructor(private router: Router) {}


  goToSigninPage(){
    this.router.navigate(['/sign-in'])
  }

  goToRegisterPage(){
    this.router.navigate(['/register'])
  }

}

