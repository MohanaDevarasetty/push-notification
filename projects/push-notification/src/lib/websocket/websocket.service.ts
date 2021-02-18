import {Injectable, Input} from '@angular/core';
import { StompService, StompConfig, StompState } from '@stomp/ng2-stompjs';
import {Observable} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {Appconstants} from '../appconstants';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
   stompService: StompService;
  broadCastMessages: Observable<Message>;
  userMessages: Observable<Message>;

  constructor() { }
  webSocketInitialization(webSocketUrl: string, token): StompConfig {
    let stompConfig: StompConfig;
    stompConfig = {
      url: webSocketUrl,
      headers: {
        login: '',
        passcode: '',
        Authorization: `Bearer ${token}`
      },
      heartbeat_in: Appconstants.WebSocketHeartBeatIn,
      heartbeat_out: Appconstants.WebSocketHeartBeatOut,
      reconnect_delay: Appconstants.WebSocketReconnectionDelayTime,
      debug: false,
    };
    return stompConfig;
  }
  socketConnection(token: string, userName: string): void {
    const stompConfiguratoin = this.webSocketInitialization(Appconstants.WEBSOCKET_ENDPOINT, token);
    this.stompService = new StompService(stompConfiguratoin);
    this.userMessages = this.stompService.subscribe(Appconstants.USERNOTIFY+userName);
    this.broadCastMessages = this.stompService.subscribe(Appconstants.BROADCAST);
  }

  getUserMessages(): Observable<Message> {
    return this.userMessages;
  }

  getBroadCastMessages(): Observable<Message> {
    return this.broadCastMessages;
  }


}
