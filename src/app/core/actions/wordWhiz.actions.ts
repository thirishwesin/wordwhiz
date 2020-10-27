import { createAction, props } from "@ngrx/store";

export const initStore = createAction("INIT_STORE_DATA", props<{ wordWhiz }>());
