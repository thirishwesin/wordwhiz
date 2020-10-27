import { wordWhizReducer } from "./wordWhiz.reducer";
import { episodeReducer } from "./episode.reducer";
import { controlReducer } from "./control.reducer";

export const Reducer = {
  wordWhiz: wordWhizReducer,
  episode: episodeReducer,
  control: controlReducer,
};
