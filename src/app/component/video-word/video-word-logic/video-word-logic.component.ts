import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-video-word-logic',
  templateUrl: './video-word-logic.component.html',
  styleUrls: ['./video-word-logic.component.scss']
})
export class VideoWordLogicComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
    this.font_size(90);
  }
  font_size(video_word_block_f) {
    document.documentElement.style.setProperty("--video-word-block-font-size", video_word_block_f +"px");
  }

}