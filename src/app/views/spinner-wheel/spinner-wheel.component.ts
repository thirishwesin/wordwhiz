import { Component, ElementRef, ViewChild } from '@angular/core';
import { Images } from "../../common/images";
import { AppConfig } from '../../../environments/environment';

@Component({
  selector: 'app-spinner-wheel',
  templateUrl: './spinner-wheel.component.html',
  styleUrls: ['./spinner-wheel.component.scss']
})
export class SpinnerWheelComponent {
  Images = Images;
  spinnerWheel: { isSpinningWheel: boolean }
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef
  videoUrl: any = `file://${this.getVideoDir()}/spinner/SpineWheel_0.mp4`;

  constructor() {
    const ipc = require("electron").ipcRenderer;

    ipc.on("spin_the_wheel", (event, message) => {
      let spinNumber = this.getSpinRandomNumber(1, 5);
      this.spinnerWheel = message;

      console.log("Current Spin Number : ", spinNumber);

      if (this.spinnerWheel.isSpinningWheel) {
        this.videoUrl = `file://${this.getVideoDir()}/spinner/SpineWheel_${spinNumber}.mp4`;
        this.videoElement.nativeElement.src = this.videoUrl;
        this.videoElement.nativeElement.play();
      } else {
        this.videoElement.nativeElement.pause();
      }
    });
  }

  getVideoDir(): string {
    if (AppConfig.production) return `${process.env.PORTABLE_EXECUTABLE_DIR}/data/videos`
    else return `${process.cwd()}/release/data/videos`
  }


  getSpinRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
