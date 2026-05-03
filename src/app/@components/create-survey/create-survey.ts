import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminQuizHttp } from '../../@services/admin-quiz-http';
import { NgModule } from '@angular/core';


@Component({
  selector: 'app-create-survey',
  imports: [FormsModule],
  templateUrl: './create-survey.html',
  styleUrl: './create-survey.scss',
})
export class CreateSurvey {
  isEditMode = false;
  quizId: number | null = null;

  // 問卷主體
  surveyData = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    published: false,
    questionList: [] as any[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminHttp: AdminQuizHttp
  ) {}

  ngOnInit() {
    // 檢查是否有 ID，有的話就是「編輯模式」
    this.quizId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.quizId) {
      this.isEditMode = true;
      this.loadQuizData();
    }
  }

  loadQuizData() {
    this.adminHttp.getQuizById(this.quizId!).subscribe(res => {
      if (res.stateCode === 200) {
        this.surveyData = { ...this.surveyData, ...res.quiz };
        // 抓取題目列表
        this.adminHttp.getQuestionsByQuizId(this.quizId!).subscribe(qRes => {
          this.surveyData.questionList = qRes.questionList || [];
        });
      }
    });
  }

  addQuestion() {
    this.surveyData.questionList.push({
      title: '',
      type: 'single', // single, multi, text
      required: false,
      options: '' // 建議後端存 String，前端用分號或換行分割
    });
  }

  removeQuestion(index: number) {
    this.surveyData.questionList.splice(index, 1);
  }

  saveSurvey() {
    if (!this.surveyData.title || !this.surveyData.startDate || !this.surveyData.endDate) {
      alert('Please fill in required fields (Title, Start/End Date)');
      return;
    }

    // 1. 拆解資料，將 questionList 改名為後端要的 questionVoList
    const { questionList, ...quizInfo } = this.surveyData;

    // 2. 構建符合 CreateQuizReq 的結構
    const payload = {
      quiz: {
        ...quizInfo,
        id: this.isEditMode ? this.quizId : 0  // 確保 id 存在
      },
      questionVoList: questionList.map((q, index) => ({
        questionId: index + 1, // 根據你後端的需求，通常需要一個編號
        question_name: q.title, // 注意：你後端變數名是 question_name 還是 title？
        type: q.type,
        required: q.required,
        optionsList: q.options ? q.options.split(';') : [] // 轉成 List<String>
      }))
    };

    const request = this.isEditMode
      ? this.adminHttp.update(payload)
      : this.adminHttp.create(payload);

    request.subscribe({
      next: (res) => {
        if (res.stateCode === 200) {
          alert(this.isEditMode ? 'Updated!' : 'Created!');
          this.router.navigate(['/adminconsole']);
        } else {
          alert('Error: ' + res.message);
        }
      },
      error: (err) => {
        console.error('完整錯誤詳情:', err);
        alert('發送失敗，請檢查 Console 的 Payload');
      }
    });
  }

  goBack() {
    this.router.navigate(['/adminconsole']);
  }
}
