import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Images } from "../../common/images";
declare var Winwheel: any;


@Component({
  selector: 'app-spinner-wheel',
  templateUrl: './spinner-wheel.component.html',
  styleUrls: ['./spinner-wheel.component.scss']
})
export class SpinnerWheelComponent implements OnInit {
  Images = Images;
  theWheel: any;
  spinnerWheel : {isSpinningWheel: boolean, spinnerWheelDuration: number} = {isSpinningWheel: false, spinnerWheelDuration: 5}

  constructor() {

    const ipc = require("electron").ipcRenderer;

    ipc.on("spin_the_wheel", (event, message) => {
      this.spinnerWheel = message
      this.theWheel = this.createWheel(this.spinnerWheel.spinnerWheelDuration)
      if (this.spinnerWheel.isSpinningWheel) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    });
  }

  ngOnInit() {
    this.theWheel = this.createWheel(this.spinnerWheel.spinnerWheelDuration)
  }

  createWheel(duration: number): any {
    return new Winwheel({
      'canvasId': 'canvas',
      'outerRadius': 230,
      'innerRadius': 20,
      'numSegments': 4,
      'textAlignment': 'center',
      'rotationAngle': -45,
      'textOrientation' : 'curved',
      'textAligment' : 'center',
      'segments':
        [
          { 'fillStyle': '#fbaeff', 'strokeStyle': '#fff', 'textFillStyle': '#5c2ee5', 'text': '1', 'textFontSize': 70 },
          { 'fillStyle': '#be97fe', 'strokeStyle': '#fff', 'textFillStyle': '#5c2ee5', 'text': '2', 'textFontSize': 70 },
          { 'fillStyle': '#fff5a4', 'strokeStyle': '#fff', 'textFillStyle': '#5c2ee5', 'text': '3', 'textFontSize': 70 },
          { 'fillStyle': '#b5f1ff', 'strokeStyle': '#fff', 'textFillStyle': '#5c2ee5', 'text': '4', 'textFontSize': 70 }
        ],
      'lineWidth': 3,
      'pins':    // Specify pin parameters.
      {
        'number': 8,
        'outerRadius': 7,
        'margin': -25,
        'fillStyle': '#edc79b',
      },
      'animation':
      {
        'type': 'spinToStop',
        'duration': duration,
        'spins': 4,
      }
    });
  }

  startAnimation() {
    this.resetAnimation();
    this.theWheel.startAnimation();
  }

  resetAnimation() {
    this.theWheel.stopAnimation(false);
    this.theWheel.rotationAngle = 0;
    this.theWheel.draw();
  }

  stopAnimation() {
    this.theWheel.stopAnimation();
  }
}
