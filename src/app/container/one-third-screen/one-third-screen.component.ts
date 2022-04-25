import { Component, OnInit } from '@angular/core';
import { Images } from '../../common/images';

@Component({
  selector: 'app-one-third-screen',
  templateUrl: './one-third-screen.component.html',
  styleUrls: ['./one-third-screen.component.scss']
})
export class OneThirdScreenComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
