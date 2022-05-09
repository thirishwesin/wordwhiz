import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-cross-word-control',
  templateUrl: './cross-word-control.component.html',
  styleUrls: ['./cross-word-control.component.scss']
})
export class CrossWordControlComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
