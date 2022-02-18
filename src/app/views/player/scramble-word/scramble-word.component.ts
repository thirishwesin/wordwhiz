import { Component, Inject, Input, OnInit } from '@angular/core';
import { ScrambleHint, ScrambleWord } from '../../../core/models/scramble';
import { DOCUMENT } from '@angular/common';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-scramble-word',
  templateUrl: './scramble-word.component.html',
  styleUrls: ['./scramble-word.component.scss']
})

export class ScrambleWordComponent implements OnInit {

  Images = Images;

  @Input() playerAnsFontSize: number;
  @Input() playerClueFontSize: number;

  @Input() scrambleWord: ScrambleWord;

  @Input() scrambleHint: ScrambleHint;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    console.log("Scramble Word => ", this.scrambleWord);
    this.setFontSizeWithClassName('answer', this.playerAnsFontSize, 'px');
    this.setFontSizeWithClassName('btn_txt', this.playerClueFontSize, 'px');
  }

  setFontSizeWithClassName(className: string, fontSize:number, sizeUnit: string) {
    this.document.querySelectorAll('.' + className).forEach(e => (e as HTMLElement).style.fontSize = fontSize + sizeUnit);
  }

}
