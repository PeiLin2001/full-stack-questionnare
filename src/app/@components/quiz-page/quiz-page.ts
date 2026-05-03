import { FillinHttp } from './../../@services/fillin-http';
import { UserHttp } from './../../@services/user-http';
import { Quiz } from './../../@interfaces/quiz';
import { Questions } from './../../@interfaces/questions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizHttp } from '../../@services/quiz-http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './quiz-page.html',
  styleUrl: './quiz-page.scss',
})
export class QuizPage implements OnInit{

  quizId: number = 0;
  backEndQuestionsRes: any[] = []; // 用來儲存後端回傳的題目清單
  backEndQuizRes: Quiz | null = null;

  get title() : string {
    return this.backEndQuizRes?.title || 'Loading...';
  }

  get description(): string{
    return this.backEndQuizRes?.description || 'Please answer the questions honestly';
  }

  get email(): string{
    return this.userService.getUserEmail();
  }

  constructor(
    private route: ActivatedRoute,
    private navRoute: Router,
    private quizService: QuizHttp,
    private userService: UserHttp,
    private fillinService:FillinHttp
  ) {}

  ngOnInit(): void {
    // 1. 從路由參數中取得 id (對應你在 routes 定義的 :id)
    this.route.params.subscribe(params => {
      this.quizId = +params['id']; // 使用 + 號將字串轉為數字 //👉 網址（URL）裡面沒有「數字型別」這種東西，全部都是字串。

      if (this.quizId) {
        this.fetchQuestions(); // 同quizlist的操作，元件一啟動就去抓資料
        this.fetchQuizInfo();
      }
    });

  }

  fetchQuestions()
  {
    this.quizService.getQuestionsByQuizId(this.quizId).subscribe({
      next: (res: any) => {
        if (res.stateCode === 200) {
          this.backEndQuestionsRes = res.questionVoList.map((q: any) => ({
            ...q,
            // 多選題需要陣列存放多個值，單選/簡答也統一用陣列，符合後端 List<String> 結構
            userAnswer: []
          }));
          console.log("Get questions successfully!", this.backEndQuestionsRes);
        } else
        {
          console.log("Fail to get questions");

        }
      },
      error: (err: any) => {
        console.log("internet error", err);
      }
    });
  }

  fetchQuizInfo(){
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (res:any) => {
        if( res.stateCode === 200 )
        {
          console.log("fetch QuizInfo successfully!");
          this.backEndQuizRes = res.quiz;
        }
        else if (res.stateCode === 403)
        {
          alert("This questionnaire isn't open for completion.");
          this.navRoute.navigate(['/quizlist']);
        }
        else
        {
          alert('TNot a valid quiz!');
          console.log(res.stateCode, res.message);
          this.navRoute.navigate(['/quizlist']);
        }
      },
      error: (err: any) => {
        console.log(err.stateCode, err.message);
      }
    });
  }

  onSubmit(){
    // Declare request body
    const requestBody = {
      quizId: this.quizId,
      email: this.email,
      answersVoList: this.backEndQuestionsRes.map(q =>({
        questionId:q.questionId,
        answerList:q.userAnswer
      }))
    }

    console.log("準備提交的資料:", requestBody);

    // subscribe post API
    this.fillinService.fillin(requestBody).subscribe({
    next: (res: any) => {
        if (res.stateCode === 200) {
          alert("Submit successfully");
        } else {
          alert(`Fail to submit: ${res.message}`);
        }
      },
      error: (err: any) => alert("A server error happened, please try later!")
    });
  }


  // 👉 處理多選題 (Checkbox) 的邏輯
  onCheckboxChange(question: any, option: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      question.userAnswer.push(option);
    } else {
      const index = question.userAnswer.indexOf(option);
      if (index > -1) question.userAnswer.splice(index, 1);
    }
  }


} // The end of the components
