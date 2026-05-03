import { Component } from '@angular/core';
import { AdminQuizHttp } from '../../@services/admin-quiz-http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../@interfaces/quiz';

@Component({
  selector: 'app-admin-console',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './admin-console.html',
  styleUrl: './admin-console.scss',
})
export class AdminConsole {

  // Declare
  quizzs: any[] = [];
  searchText = '';
  fromDate = '';
  toDate = '';

  constructor(
    private adminQuizSer: AdminQuizHttp,
    private router: Router
  ){}

  ngOnInit() {
    this.fetchData(); // 3. 元件一啟動就去抓資料
  }

  // Fetch data form backend
  fetchData(){
    this.adminQuizSer.getQuizList(false).subscribe((res: any) => {
      console.log("AAA",res);

      if(res.stateCode === 200)
      {
        this.quizzs = res.quizList;
      }
    });
  }

  // Reset filter
  resetFilters() {
    this.searchText = '';
    this.fromDate = '';
    this.toDate = '';
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

  // Direct to the selected quiz page
  goToEditPage(quiz:Quiz){
      this.router.navigate(['/edit', quiz.id]);
  }


  // 1. 導向新增頁面
  goToCreatePage() {
    this.router.navigate(['/admin/create']); // 假設這是你的路徑
  }

  // 2. 導向統計圖表頁面
  goToStats(quizId: number) {
    this.router.navigate(['/admin/statistics', quizId]); // 假設這是你的路徑
  }

  // 3. 刪除問卷功能
  deleteQuiz(quizId: number) {
    if (confirm(`Are you sure you want to delete quiz #${quizId}? This action cannot be undone.`)) {
      // 呼叫你的 AdminQuizHttp service
      this.adminQuizSer.delete(quizId).subscribe({
        next: (res: any) => {
          if (res.stateCode === 200) {
            alert('Deleted successfully!');
            this.fetchData(); // 重新抓取資料更新畫面
          } else {
            alert('Delete failed: ' + res.message + res.stateCode);
          }
        },
        error: (err: any) => {
          console.error('Delete error:', err);
          alert('An error occurred while deleting.' + err.stateCode);
        }
      });
    }
  }

  // 4. (選配) 更細緻的狀態判斷邏輯
  // 如果你想在 HTML 顯示「進行中」、「已結束」，可以用這個方法
  getQuizStatus(quiz: Quiz): 'Published' | 'Draft' | 'Ended' {
    if (!quiz.published) return 'Draft';

    const today = new Date().setHours(0,0,0,0);
    const end = new Date(quiz.endDate).getTime();

    if (today > end) return 'Ended';
    return 'Published';
  }
}
