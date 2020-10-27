import { Hint } from "./hint";

export interface Question {
  id: number;
  clue: string;
  categoryId: number;
  hints: Hint[];
  ans: string;
  isAnsCharacter: boolean;
}
