import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AppConfig } from "../../../../environments/environment";

@Component({
  selector: 'app-round-five',
  templateUrl: './round-five.component.html',
  styleUrls: ['./round-five.component.scss']
})
export class RoundFiveComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() videoName: string
  @Input() currentEpisodeId: number
  @Input() isPlay: boolean
  @ViewChild('videoElement', {static: false}) videoElement: ElementRef
  videoUrl: string
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.videoUrl = `file://${this.getVideoDir()}/episode${this.currentEpisodeId}/${this.videoName}.mp4`;
    if(this.videoElement != undefined){
      if(this.isPlay) this.videoElement.nativeElement.play();
    else this.videoElement.nativeElement.pause();
    }
  }
  ngOnInit() {

  }

  ngAfterViewInit(): void {
   console.log('video element => ' , this.videoElement.nativeElement)
  }

  getVideoDir(): string{
    if (AppConfig.production) return `${process.env.PORTABLE_EXECUTABLE_DIR}/data/videos`
    else return `${process.cwd()}/release/data/videos`
  }


}
