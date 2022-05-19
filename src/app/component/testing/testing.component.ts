import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  startTimer: boolean;
  timeout: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  back(): void {
    this.router.navigateByUrl('');
  }

  clickTimerButton(): void {
    this.startTimer = !this.startTimer;
  }

  chooseNumber(timeOut: number): void {
    this.timeout = timeOut;
  }

}
