import { Hint } from "./hint";

export interface Question {
  id: number;
  clue: string;
  clueFontSize: number;
  otClueFontSize: number;
  categoryId: number;
  hints: Hint[];
  ans: string;
  ansFontSize: number;
  otAnsFontSize: number;
  isAnsCharacter: boolean;
}
