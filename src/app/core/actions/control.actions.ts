import { createAction, props } from "@ngrx/store";

export const initControlStore = createAction(
  "INIT_CONTROL_STORE_DATA",
  props<{ control }>()
);

export const updateFontSettingControl = createAction(
  "UPDATE_FONT_SETTING_CONTROL",
  props<{ fontSettings }>()
);

export const updateStoreFromControl = createAction(
  "UPDATE_STORE",
  props<{ control }>()
);
export const updateCurrentEpisodeId = createAction(
  "UPDATE_CURRENT_EPISODE_ID",
  props<{ currentEpisodeId: number }>()
);

export const updateCurrentRoundId = createAction(
  "UPDATE_CURRENT_ROUND_ID",
  props<{ currentRoundId: number }>()
);

export const updateCurrentQuestionId = createAction(
  "UPDATE_CURRENT_QUESTION_ID",
  props<{ control }>()
);

export const updateShowQuestion = createAction("UPDATE_SHOW_QUESTION");

export const updateShowAns = createAction(
  "UPDATE_SHOW_ANS",
  props<{ control }>()
);

export const updateExraWord = createAction(
  "UPDATE_EXTRA_WORD",
  props<{ extraWord }>()
);

export const animatedExtraWord = createAction(
  "ANIMATED_EXTRA_WORD", props<{ animationExtraWord }>()
);

export const updateStartCount = createAction(
  "UPDATE START COUNT",
  props<{ control }>()
);

export const resetTimeOut = createAction("RESET_TIME_OUT");

export const updateClickPoint = createAction(
  "UPDATE_CLICK_POINT",
  props<{ clickPoint }>()
);

export const updateClickTimer = createAction(
  "UPDATE_CLICK_TIMER",
  props<{ clickTimer }>()
);

export const resetCategoryRound = createAction("RESET_CATEGORY_ROUND");

export const runCategoryRound = createAction("RUN_CATEGORY_ROUND");

export const endCategoryRound = createAction("END_CATEGORY_ROUND");

export const ShowAnsForCategoryRound = createAction("UPDATE_SHOW_ANS");
