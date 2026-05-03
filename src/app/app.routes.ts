import { Register } from './@components/register/register';
import { Home } from './@components/home/home';
import { Routes } from '@angular/router';
import { StartReminder } from './@components/start-reminder/start-reminder';
import { SignIn } from './@components/sign-in/sign-in';
import { AdminLogin } from './@components/admin-login/admin-login';
import { Quizlist } from './@components/quizlist/quizlist';
import { QuizPage } from './@components/quiz-page/quiz-page';
import { quizStatusGuard } from './auth/quiz-status-guard';
import { AdminConsole } from './@components/admin-console/admin-console';
import { CreateSurvey } from './@components/create-survey/create-survey';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'home',
    component: Home,
    title: 'Home page',
  },
  {
    path: 'start-reminder',
    component: StartReminder,
    title: 'Start',
  },
  {
    path: 'register',
    component: Register,
    title: 'Register',
  },
  {
    path: 'sign-in',
    component: SignIn,
    title: 'Sign in',
  },
  {
    path: 'admin/login',
    component: AdminLogin,
    title: 'Admin log in',
  },
  {
    path: 'quizlist',
    component: Quizlist,
    title: 'quizs!',
    canActivate: [quizStatusGuard]
  },
  {
    path: 'quiz-page/:id',
    component: QuizPage,
    title: 'quizpage',
    canActivate: [quizStatusGuard] // 進入前先檢查
  },
  {
    path: 'adminconsole',
    component: AdminConsole,
    title: 'admin console',
    // canActivate: [quizStatusGuard] // 進入前先檢查
  },
  {
    path: 'admin/create',
    component: CreateSurvey,
    title: 'Create New Survey',
  },
  {
    path: 'admin/edit/:id', // 修正你之前的導航錯誤，統一放在 admin 底下
    component: CreateSurvey, // 編輯和新增通常可以用同一個 Component
    title: 'Edit Survey',
  }
];
