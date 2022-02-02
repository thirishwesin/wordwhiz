import { Component, Input, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-typo-word',
  templateUrl: './typo-word.component.html',
  styleUrls: ['./typo-word.component.scss']
})
export class TypoWordComponent implements OnInit {

  Images = Images;
  @Input() typoWordImage: any;

  constructor() { }

  ngOnInit() {
  }

}
