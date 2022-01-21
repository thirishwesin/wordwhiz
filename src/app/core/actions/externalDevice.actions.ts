import { createAction, props } from "@ngrx/store";


export const onlineUser = createAction("Retrieve online user from external device event listenner",
props<{onlineUser: string}>());
export const offlineUser = createAction("Retrieve offline user from external device event listenner",
props<{offlineUser: string}>());
export const wordWhizIsConnected = createAction("Word Whiz is connected", props<{isConnected: boolean}>());
