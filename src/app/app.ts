import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./@components/navbar/navbar";
import { Router, NavigationStart, NavigationError, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('questionnare-fullstack');

  constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      console.log('開始導航到:', event.url);
    }
    if (event instanceof NavigationError) {
      console.error('導航失敗原因:', event.error);
    }
    if (event instanceof NavigationEnd) {
      console.log('成功到達:', event.url);
    }
  });
}
}
