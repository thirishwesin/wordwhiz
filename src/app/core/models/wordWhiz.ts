import { Episode } from "./episode";
import { QuestionTypes } from "./questionTypes";
import { FontSettings } from './fontSettings'

export interface WordWhiz {
  episodes: Episode[];
  questionTypes: QuestionTypes[];
  fontSettings: FontSettings
}
