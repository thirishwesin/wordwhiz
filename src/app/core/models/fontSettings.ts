import { ExternalDeviceSetting, ScreenPropertytSetting } from "./settings";

export interface FontSettings {
  main_roundName: number;
  main_clue: number;
  main_hint: number;
  main_answer: number;
  main_timeOut: number;
  oneThird_timeOut: number;
  oneThird_hint: number;
  oneThird_answer: number;
  player_point: number;
  externalDeviceSetting: ExternalDeviceSetting,
  screenPropertytSetting: ScreenPropertytSetting
}
