import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Stomp } from "@stomp/stompjs";
import { wordWhizIsConnected, offlineUser, onlineUser } from '../actions/externalDevice.actions';
import { ExternalDevice } from '../models/externalDevice';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  websocket: any
  disabled: boolean
  onlineUsers: string[] = []

  constructor(private store: Store<{externalDevice: ExternalDevice}> ) { }

  initWebSocketConnection(websocketUrl: string): void {
    // ws://localhost:8080/ws/websocket
    console.log('websocketUrl: ' + websocketUrl)
    let socket = new WebSocket(websocketUrl);
    this.websocket = Stomp.over(socket);
    let that = this;
    this.websocket.connect(
      {
        username: 'control-screen',
      },
      function (frame) {
        console.log(frame)
        if(frame.command === 'CONNECTED'){
          that.store.dispatch(wordWhizIsConnected({isConnected: true}))
        }
        that.subscribeAppScreen()
        that.disabled = true;
      },
      function(error) {
        console.log("STOMP error ", error);
      }
    );
  }

  disconnect(): void {
    if (this.websocket != null) {
      this.websocket.ws.close();
    }
    this.disabled = false;
    this.store.dispatch(wordWhizIsConnected({isConnected: false}))
    console.log("Disconnected");
  }

  sendQuestion(): void {
    let question = JSON.stringify({
      'question': 'Question one',
      'toPlayer': 'player1'
    })
    this.websocket.send("/control-screen/show/question/to/specific-player", {}, question);
  }

  subscribeAppScreen(){
    let that = this;
    this.websocket.subscribe('/external-device/submit/answer', function (answer) {
      let ansewrObj = JSON.parse(answer.body);
      console.log('answer: ', ansewrObj)
    });
    this.websocket.subscribe('/external-device/send/online-user', function (userInfo) {
      let username = userInfo.body;
      that.store.dispatch(onlineUser({onlineUser: username}))
    });
    this.websocket.subscribe('/external-device/send/offline-user', function (userInfo) {
      let username = userInfo.body;
      that.store.dispatch(offlineUser({offlineUser: username}))
    });
  }


}
