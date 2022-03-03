import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-typo-word',
  templateUrl: './typo-word.component.html',
  styleUrls: ['./typo-word.component.scss']
})
export class TypoWordComponent implements OnInit {

  Images = Images;
  @Input() typoWordQuestion: string;
  @Input() typoWordImage: any;
  @Input() playerClueFontSize: number;


  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.getElementById("typo_question").style.fontSize = this.playerClueFontSize + 'px';
  }

}
