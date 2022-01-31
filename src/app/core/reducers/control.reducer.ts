import { createReducer, on, State } from "@ngrx/store";
import {
  updateCurrentRoundId,
  updateCurrentEpisodeId,
  updateCurrentQuestionId,
  initControlStore,
  updateStartCount,
  updateStoreFromControl,
  updateShowQuestion,
  updateShowAns,
  updateExraWord,
  resetCategoryRound,
  runCategoryRound,
  endCategoryRound,
  ShowAnsForCategoryRound,
  updateFontSettingControl,
  updateClickPoint,
  resetTimeOut,
  updateClickTimer,
  animatedExtraWord,
  updatePlayerScreenBackground
} from "../actions/control.actions";
import { Control } from "../models/control";
import { TimerEnum } from "../models/timerEnum";

export const initialState: Control = {
  currentEpisodeId: 0,
  currentRoundId: 1,
  currentQuestionId: 1,
  startCount: TimerEnum.STOP,
  resetCount: false,
  showQuestion: false,
  showAns: false,
  clickExtraKey: false,
  extraWord: [],
  runCategoryRound: false,
  finishCategoryRound: false,
  fontSettings: {
    main_roundName: 45,
    main_clue: 45,
    main_hint: 47,
    main_answer: 47,
    main_timeOut: 50,
    oneThird_timeOut: 25,
    oneThird_hint: 35,
    oneThird_answer: 35,
    player_point: 134,
    externalDeviceSetting: {
      websocketUrl: "ws://localhost:8081/ws/websocket"
    },
    screenPropertytSetting: {
      spinnerWheelDuration: 5
    }
  },
  clickPoint: false,
  clickTimer: false,
  animationExtraWord: "",
  fontSettingOpenClose: false,
  roundTwoStatus: undefined,
  roundFourStatus: [],
  isChangePlayerBgImage: true,
  isPlay: false
};

const _controlReducer = createReducer(
  initialState,
  on(initControlStore, (state, { control }) => {
    state = { ...control, startCount: TimerEnum.STOP };
    return state;
  }),
  on(updateFontSettingControl, (state, fontSettings) => {
    state.fontSettings = fontSettings.fontSettings;
    return state;
  }),
  on(updatePlayerScreenBackground, (state, { isChangePlayerBgImage }) => {
    //update currentEpisode & reset others (round & questions)
    console.log("isChangePlayerBgImage ", isChangePlayerBgImage);

    return { ...state, isChangePlayerBgImage: isChangePlayerBgImage };
  }),
  on(updateStoreFromControl, (state, { control }) => (state = control.control)),
  on(updateCurrentEpisodeId, (state, { currentEpisodeId }) => {
    //update currentEpisode & reset others (round & questions)
    return { ...initialState, currentEpisodeId };
  }),
  on(updateCurrentRoundId, (state, { currentRoundId }) => {
    //update currentRound & reset others (startCount and showAns) except EpisodeId
    return {
      ...initialState,
      extraWord: [],
      currentRoundId,
      isChangePlayerBgImage: state.isChangePlayerBgImage,
      currentEpisodeId: state.currentEpisodeId
    };
  }),
  on(updateCurrentQuestionId, (state, { control }) => {
    return {
      ...initialState,
      runCategoryRound: state.runCategoryRound,
      ...control,
      extraWord: [],
      currentEpisodeId: state.currentEpisodeId,
      currentRoundId: state.currentRoundId,
    };
  }),
  on(updateShowQuestion, state => {
    return {
      ...state,
      showQuestion: !state.showQuestion,
      startCount: TimerEnum.STOP,
      showAns: false,
      resetCount: false,
      // for animation
      clickExtraKey: false,
      clickPoint: false
    };
  }),
  on(updateShowAns, state => {
    return { ...state, showAns: !state.showAns, startCount: TimerEnum.STOP };
  }),
  on(ShowAnsForCategoryRound, state => {
    return { ...state, showAns: true, startCount: TimerEnum.STOP };
  }),
  on(updateExraWord, (state, { extraWord }) => {
    return {
      ...state,
      clickExtraKey: true,
      extraWord
    };
  }),
  on(animatedExtraWord, (state, animationExtraWord) => {
    return {
      ...state,
      animationExtraWord: animationExtraWord.animationExtraWord
    };
  }),
  on(updateFontSettingControl, (state, fontSettingOpenClose) => {
    return { ...state, fontSettingOpenClose: fontSettingOpenClose };
  }),
  on(updateClickPoint, (state, clickPoint) => {
    return { ...state, clickPoint: true };
  }),
  on(updateClickTimer, (state, clickTimer) => {
    return { ...state, clickTimer: clickTimer.clickTimer };
  }),
  on(resetTimeOut, state => {
    return { ...state, resetCount: true };
  }),
  on(updateStartCount, state => {
    state.startCount = state.startCount == TimerEnum.STOP ? TimerEnum.START: TimerEnum.STOP;
    state.clickExtraKey = false;
    state.clickPoint = false;
    state.resetCount = false;
    return state;
  }),
  on(resetCategoryRound, state => {
    return { ...state, runCategoryRound: false, finishCategoryRound: false };
  }),
  on(runCategoryRound, state => {
    return {
      ...state,
      runCategoryRound: true,
      finishCategoryRound: false,
      resetCount: false
    };
  }),
  on(endCategoryRound, state => {
    return {
      ...state,
      runCategoryRound: false,
      finishCategoryRound: true,
      showQuestion: true,
      startCount: TimerEnum.STOP
    };
  })
);

export function controlReducer(state, action) {
  return _controlReducer(state, action);
}
