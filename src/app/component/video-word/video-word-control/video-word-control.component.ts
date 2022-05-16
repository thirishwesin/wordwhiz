import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-video-word-control',
  templateUrl: './video-word-control.component.html',
  styleUrls: ['./video-word-control.component.scss']
})
export class VideoWordControlComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
