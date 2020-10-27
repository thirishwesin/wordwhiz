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
  animatedExtraWord
} from "../actions/control.actions";
import { Control } from "../models/control";

export const initialState: Control = {
  currentEpisodeId: 0,
  currentRoundId: 1,
  currentQuestionId: 1,
  startCount: false,
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
    player_point: 134
  },
  clickPoint: false,
  clickTimer: false,
  animationExtraWord: "",
  fontSettingOpenClose: false
};

const _controlReducer = createReducer(
  initialState,
  on(initControlStore, (state, { control }) => {
    state = { ...control, startCount: false };
    return state;
  }),
  on(updateFontSettingControl, (state, fontSettings) => {
    state.fontSettings = fontSettings.fontSettings;
    return state;
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
      currentRoundId: state.currentRoundId
    };
  }),
  on(updateShowQuestion, state => {
    return {
      ...state,
      showQuestion: !state.showQuestion,
      startCount: false,
      showAns: false,
      resetCount: false,
      // for animation
      clickExtraKey: false,
      clickPoint: false
    };
  }),
  on(updateShowAns, state => {
    return { ...state, showAns: !state.showAns, startCount: false };
  }),
  on(ShowAnsForCategoryRound, state => {
    return { ...state, showAns: true };
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
    state.startCount = !state.startCount;
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
      startCount: false
    };
  })
);

export function controlReducer(state, action) {
  return _controlReducer(state, action);
}
