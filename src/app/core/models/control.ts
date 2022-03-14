import { RoundFourStatus } from './roundTwoStatus';
import { ExtraWord } from "./extraWord";
import { FontSettings } from "./fontSettings";
import { TimerEnum } from './timerEnum';

export interface Control {
  currentEpisodeId: number;
  currentRoundId: number;
  currentQuestionId: number;
  currentPlayerId: string;
  startCount: TimerEnum;
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
  roundFourStatus: RoundFourStatus[];
  roundTwoStatus: string;
  isChangePlayerBgImage: boolean;
  isPlay: boolean;
  isShowQuestionInTablet: boolean;
  playersToChangeBgImage: number[];
  isShowPlayersPoint: boolean;
}
