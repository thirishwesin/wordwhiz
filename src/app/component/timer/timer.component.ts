import { Component, OnInit } from '@angular/core';
import { Images } from '../../common/images';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
