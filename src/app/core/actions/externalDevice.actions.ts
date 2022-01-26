import { createAction, props } from "@ngrx/store";
import { Answer } from "../models/answer";


export const onlineUser = createAction("Retrieve online user from external device event listenner",
props<{onlineUser: string}>());
export const offlineUser = createAction("Retrieve offline user from external device event listenner",
props<{offlineUser: string}>());
export const wordWhizIsConnected = createAction("Word Whiz is connected", props<{isConnected: boolean}>());
export const playerAnswer = createAction("Retrieve player answer", props<{playerAnswer: Answer}>());
