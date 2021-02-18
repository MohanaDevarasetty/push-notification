import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { WebsocketService } from './websocket/websocket.service';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';

@Component({
  selector: 'lib-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.css'],
})
export class PushNotificationComponent implements OnInit {
  notificationList: any[] = [];
  notificationData: any[] = [];

  @Input('token') token: string;
  stompService: StompService;
  @Input('userName') userName: string;
  @Output() activeNotificationCount = new EventEmitter();
  constructor(private websocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.websocketService.socketConnection(this.token, this.userName);
    this.getNotifications();
  }

  getNotifications(): void {
    this.websocketService.getUserMessages().subscribe((message: Message) => {
      if (message) {
        this.insertPushNotification(message.body);
      }
    });
    this.websocketService.getBroadCastMessages().subscribe((mes: Message) => {
      if (mes) {
        this.insertPushNotification(mes.body);
      }
    });
  }

  insertPushNotification(notifications: any): void{
    if (notifications){
      this.notificationList.unshift(JSON.parse(notifications));
      if (this.notificationList.length > 0){
         this.notificationData = this.notificationList.length > 10 ? this.notificationList.slice(0, 10) : this.notificationList;
         this.activeNotificationCount.emit(this.notificationData.length);
      }else {
        this.activeNotificationCount.emit(0);
      }
    }
  }
}
