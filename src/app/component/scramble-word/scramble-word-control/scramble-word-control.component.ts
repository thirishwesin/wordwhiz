import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-scramble-word-control',
  templateUrl: './scramble-word-control.component.html',
  styleUrls: ['./scramble-word-control.component.scss']
})
export class ScrambleWordControlComponent implements OnInit {

  Images = Images;
  
  constructor() { }

  ngOnInit(): void {
  }

}
