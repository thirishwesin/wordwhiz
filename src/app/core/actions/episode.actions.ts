import { createAction, props } from "@ngrx/store";

export const updateEpisodeStore = createAction(
  "UPDATE_EPISODE_STORE",
  props<{ episode }>()
);

export const initEpisodeStore = createAction(
  "INIT_EPISODE_STORE",
  props<{ episode }>()
);
