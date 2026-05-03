import { UserHttp } from './../../@services/user-http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
// Secret code
  // Declare buffer string and secret code
  buffer: string = "";
  secretCode: string = "882244669173";
  private timer: any;

  // Core logic
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent){
    if(/^\d$/.test(event.key)){
      // 每次按下數字就重置計時器
      clearTimeout(this.timer);

      this.buffer += event.key;

      if(this.buffer.includes(this.secretCode)){
        this.triggerSecretRedirect();
      }

      // 如果 3 秒內沒按鍵，就清空快取
      this.timer = setTimeout(() => {
        this.buffer = '';
      }, 3000);

      // 為了效能與安全，如果緩衝字串太長（例如超過 50 個字），就清空它
      if (this.buffer.length > 20) {
        this.buffer = this.buffer.substring(this.buffer.length - 12);
      }

    }
  }
  // Sub logic of secret code
  private triggerSecretRedirect(){
    console.log('start to direct...');
    this.router.navigate(['/admin/login']);
  }


  // Router
  constructor(
    private router: Router,
    private userService:UserHttp
  ) {
    console.log('目前登入狀態:', this.userService.isLoggedIn());
  }


  nextStep(){
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/quizlist'])
    } else {
      this.router.navigate(['/start-reminder'])
    }
  }


  // test()
  // {
  //   // Get an array of all key names
  //   const keys = Object.keys(localStorage);
  //   console.log(keys); // Output: ["user", "theme", "settings"]

  //   // Get both keys and values together
  //   const entries = Object.entries(localStorage);
  //   console.log(entries);

  // }
}
