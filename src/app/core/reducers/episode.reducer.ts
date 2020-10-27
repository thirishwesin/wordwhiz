import { createReducer, on } from "@ngrx/store";
import { Episode } from "../models/episode";
import {
  updateEpisodeStore,
  initEpisodeStore,
} from "../actions/episode.actions";
import { updateStoreFromControl } from "../actions/control.actions";

export const initialState: Episode = {
  id: 0,
  players: [],
  rounds: [],
};

const _episodeReducer = createReducer(
  initialState,
  on(updateStoreFromControl, (state, { control }) => (state = control.episode)),
  on(updateEpisodeStore, (state, { episode }) => (state = episode)),
  on(initEpisodeStore, (state, { episode }) => (state = episode))
);

export function episodeReducer(state, action) {
  return _episodeReducer(state, action);
}
