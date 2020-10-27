import { Round } from "./round";
import { Question } from "./question";
import { QuestionCategory } from "./questionCategory";

export interface Round {
  id: number;
  name: string;
  questionType: number;
  showfirstAnsChar: boolean;
  hasCategory: boolean;
  categories: QuestionCategory[];
  timeOut: number;
  point: number;
  questionArray: Question[];
}
