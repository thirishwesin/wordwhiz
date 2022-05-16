import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-word-logic-onethird',
  templateUrl: './video-word-logic-onethird.component.html',
  styleUrls: ['./video-word-logic-onethird.component.scss']
})
export class VideoWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(100);
  }
  font_size(video_word_block_f) {
    document.documentElement.style.setProperty("--video-word-block-font-size", video_word_block_f +"px");
  }

}