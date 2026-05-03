export interface Questions {
  quizId: number;
  questionId: number;
  questionName: string;
  type: string;
  options: string[];
  required: boolean;
  optionsList:[];
}
