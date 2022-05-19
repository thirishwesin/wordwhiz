import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Images } from '../../../common/Images';

@Component({
  selector: 'app-simple-timer',
  templateUrl: './simple-timer.component.html',
  styleUrls: ['./simple-timer.component.scss']
})
export class SimpleTimerComponent implements OnInit, OnChanges {

  @Input('timeOut') timeOut: number;
  @Input('startTimer') startTimer: boolean;
  interval: NodeJS.Timeout;
  Images = Images;
  count: number;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    const changedTimeOut = changes['timeOut']?.currentValue;
    if(changedTimeOut){
      // convert to millisecond and added 99 coz time out(10s) change to 9s immediately.
      this.timeOut = (changedTimeOut * 100) + 99;
      this.count = changedTimeOut;
    }
    this.startTimer = changes['startTimer']?.currentValue;
    this.runTimer(this.startTimer);
  }

  ngOnInit(): void {
  }

  runTimer(startTimer: boolean): void {
    if(startTimer) {
      this.interval = setInterval(() => {
        if (this.timeOut <= 0) {
          clearInterval(this.interval);
        } else {
          this.timeOut = this.timeOut - 1;
          this.count = Math.floor(this.timeOut / 100);
        }
      }, 10);
    }else clearInterval(this.interval);
  }

}
