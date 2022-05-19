import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  startApngTimer: boolean;
  apngTimeout: number;

  startSimpleTimer: boolean;
  simpleTimeout: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  back(): void {
    this.router.navigateByUrl('');
  }

  clickApngTimerButton(): void {
    this.startApngTimer = !this.startApngTimer;
  }

  chooseApngNumber(timeOut: number): void {
    this.apngTimeout = timeOut;
  }

  clickSimpleTimerButton(): void {
    this.startSimpleTimer = !this.startSimpleTimer;
  }

  chooseSimpleNumber(timeOut: number): void {
    this.simpleTimeout = timeOut;
  }

}
