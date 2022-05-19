import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-wrong-word-control',
  templateUrl: './wrong-word-control.component.html',
  styleUrls: ['./wrong-word-control.component.scss']
})
export class WrongWordControlComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
