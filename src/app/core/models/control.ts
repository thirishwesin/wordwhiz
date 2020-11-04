import { ExtraWord } from "./extraWord";
import { FontSettings } from "./fontSettings";
import { RoundTwoStatus } from "./roundTwoStatus";

export interface Control {
  currentEpisodeId: number;
  currentRoundId: number;
  currentQuestionId: number;
  startCount: boolean;
  resetCount: boolean;
  showQuestion: boolean;
  showAns: boolean;
  clickExtraKey: boolean;
  extraWord: ExtraWord[];
  runCategoryRound: boolean;
  finishCategoryRound: boolean;
  fontSettings: FontSettings;
  clickPoint: boolean;
  clickTimer: boolean;
  animationExtraWord: string
  fontSettingOpenClose: boolean;
  roundTwoStatus: RoundTwoStatus[];
}
