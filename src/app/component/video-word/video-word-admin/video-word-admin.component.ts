import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-video-word-admin',
  templateUrl: './video-word-admin.component.html',
  styleUrls: ['./video-word-admin.component.scss']
})
export class VideoWordAdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
