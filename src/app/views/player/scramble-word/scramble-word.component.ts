import { Component, Inject, Input, OnInit } from '@angular/core';
import { ScrambleHint, ScrambleWord } from '../../../core/models/scramble';
import { DOCUMENT } from '@angular/common';
import { playerAnswer } from '../../../core/actions/externalDevice.actions';

@Component({
  selector: 'app-scramble-word',
  templateUrl: './scramble-word.component.html',
  styleUrls: ['./scramble-word.component.scss']
})
export class ScrambleWordComponent implements OnInit {

  @Input() playerAnsFontSize: number;
  @Input() playerClueFontSize: number;

  @Input() scrambleWord: ScrambleWord = {
    word1: '',
    word2: '',
    word3: '',
    word4: ''
  };

  @Input() scrambleHint: ScrambleHint = {
    hint1: '',
    hint2: '',
    hint3: '',
    hint4: ''
  }

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.setFontSizeWithClassName('answer', this.playerAnsFontSize, 'px');
    this.setFontSizeWithClassName('btn_txt', this.playerClueFontSize, 'px');
  }

  setFontSizeWithClassName(className: string, fontSize:number, sizeUnit: string) {
    this.document.querySelectorAll('.' + className).forEach(e => (e as HTMLElement).style.fontSize = fontSize + sizeUnit);
  }

}
