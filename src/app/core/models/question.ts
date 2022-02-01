import { Hint } from "./hint";

export interface Question {
  id: number;
  clue: string;
  clueFontSize: number;
  otClueFontSize: number;
  playerClueFontSize?: number;
  tabletClueFontSize?: number;
  categoryId: number;
  hints: Hint[];
  ans: string;
  ansFontSize: number;
  otAnsFontSize: number;
  playerAnsFontSize?: number;
  tabletAnsFontSize?: number;
  isAnsCharacter: boolean;
}
