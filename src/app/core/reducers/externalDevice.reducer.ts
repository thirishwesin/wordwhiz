import { createReducer, on } from "@ngrx/store";
import { wordWhizIsConnected, offlineUser, onlineUser, playerAnswer } from "../actions/externalDevice.actions";
import { ExternalDevice } from "../models/externalDevice";


export const initialState: ExternalDevice = {
  onlineUser: undefined,
  offlineUser: undefined,
  onlineUsers: new Set<string>([]),
  wordWhizIsConnected: false,
  playerAnswer: undefined
}

const _externalDeviceReducer = createReducer(
  initialState,
  on(onlineUser, (state, {onlineUser}) => {
    state = {...state, onlineUser: onlineUser, onlineUsers: state.onlineUsers.add(onlineUser)}
    return state;
  }),
  on(offlineUser, (state, {offlineUser}) => {
    if(state.onlineUsers.has(offlineUser)){
      state.onlineUsers.delete(offlineUser)
      state = {...state}
    }
    return state = {...state, offlineUser: offlineUser};
  }),
  on(wordWhizIsConnected, (state, {isConnected}) => {
    // celar external device data
    state.onlineUsers.clear();
    return state = {...initialState, wordWhizIsConnected: isConnected}
  }),
  on(playerAnswer, (state, {playerAnswer}) => {
    state = {...state, playerAnswer: playerAnswer}
    return state;
  })
)

export function externalDeviceReducer (state, action) {
  return  _externalDeviceReducer(state, action)
}
