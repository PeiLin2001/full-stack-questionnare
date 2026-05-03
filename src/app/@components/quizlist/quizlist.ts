import { Quiz } from './../../@interfaces/quiz';
import { UserHttp } from './../../@services/user-http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuizHttp } from '../../@services/quiz-http';
import { User } from '../../@interfaces/user';

@Component({
  selector: 'app-quizlist',
  imports: [FormsModule],
  templateUrl: './quizlist.html',
  styleUrl: './quizlist.scss',
})
export class Quizlist {
  // Declare
  searchText = '';
  fromDate = '';
  toDate = '';
  name = '';
  user = {} as User;
  quiz = {} as Quiz;
  quizzs:Quiz[] = []

  constructor(
    private quizService: QuizHttp,
    private userService:UserHttp,
    private router: Router
  ){}

  ngOnInit() {
    this.fetchData(); // 3. 元件一啟動就去抓資料
  }

  // Fetch data form backend
  fetchData(){
    this.quizService.getQuizList(true).subscribe((res: any) => {
      console.log("AAA",res);

      if(res.stateCode === 200)
      {
        this.quizzs = res.quizList;
      }
    });
  }

  // Determine if the questionnare is clickable (based on date)
  isAvaliable(startDate:string, endDate:string): boolean{
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return today >= start && today <= end;
  }

  // Direct to the selected quiz page
  goToQuiz(quiz:Quiz){
    if (this.isAvaliable(quiz.startDate, quiz.endDate))
    {
      this.router.navigate(['/quiz-page', quiz.id]);
    }
  }

  // classify the questionlist by time
  isRescently(startDate:string): boolean{
    const today = new Date().valueOf();
    const start = new Date(startDate).valueOf();
    const difference = today - start;

    return difference < 2419200000;
  }

  // filter the list
  get filteredList(): Quiz[]{
    return this.quizzs.filter(quizs => {
      // keywords search
      const isMatchesSearch: boolean = quizs.title.toLowerCase().includes(this.searchText.toLowerCase());

      // search by date
      const quizStartD = new Date(quizs.startDate).getTime();
      const quizEndD = new Date(quizs.endDate).getTime();

      const filteredFrom = this.fromDate ? new Date(this.fromDate).setHours(0,0,0,0) : null;
      const filteredTo = this.toDate ? new Date(this.toDate).setHours(23,59,59,999) : null;

      let isMatchDate: boolean = true;

      if (filteredFrom && filteredFrom > quizStartD) isMatchDate = false;
      if (filteredTo && filteredTo < quizEndD) isMatchDate = false;

      return isMatchDate && isMatchesSearch
    });
  }

  get recentList(): Quiz[]{
    return this.filteredList.filter(item => this.isRescently(item.startDate));
  }

  get pastList(): Quiz[]{
    return this.filteredList.filter(item => !this.isRescently(item.startDate));
  }

  // hasNoLength(): boolean{
  //   if (this.filteredList.length === 0)
  //   {
  //     return true;
  //   }
  //   return false;
  // }

  get hasNoLength(): boolean{
    return this.filteredList.length === 0;
  }

  setDateRange(days:number){
    // declare
    const today = new Date();
    const from = new Date();

    // calculate range
    from.setDate(today.getDate() - days)

    // convert the result to string and assign to HTML variable
    // 格式化為 YYYY-MM-DD
    // this.toDate = this.formatToDateString(today);
    this.searchText = '';
    this.fromDate = this.formatToDateString(from);
  }

  // 計算時區日期並轉換成HTML支援的格式
  private formatToDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Reset filter
  resetFilters() {
    this.searchText = '';
    this.fromDate = '';
    this.toDate = '';
  }
}
