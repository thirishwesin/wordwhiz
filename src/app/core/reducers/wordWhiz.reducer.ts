import { createReducer, on } from "@ngrx/store";
import { initStore } from "../actions/wordWhiz.actions";
import { WordWhiz } from "../models/wordWhiz";

export const initialState: WordWhiz = {
  episodes: [],
  questionTypes: [],
  fontSettings: null
};

const _wordWhizReducer = createReducer(
  initialState,
  on(initStore, (state, { wordWhiz }) => (state = wordWhiz))
);

export function wordWhizReducer(state, action) {
  return _wordWhizReducer(state, action);
}
