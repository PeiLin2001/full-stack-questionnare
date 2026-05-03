import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserHttp } from '../@services/user-http';

export const quizStatusGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserHttp);

  // 檢查 sessionStorage 是否有我們登入時存的 token
  const userToken = sessionStorage.getItem('userToken');

  if (userService.isLoggedIn()) {
    return true;
  } else {
    alert('Please log in !');
    router.navigate(['/home']);
    return false;
  }
};
