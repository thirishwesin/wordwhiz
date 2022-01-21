import { wordWhizReducer } from "./wordWhiz.reducer";
import { episodeReducer } from "./episode.reducer";
import { controlReducer } from "./control.reducer";
import { externalDeviceReducer } from "./externalDevice.reducer";

export const Reducer = {
  wordWhiz: wordWhizReducer,
  episode: episodeReducer,
  control: controlReducer,
  externalDevice: externalDeviceReducer
};
