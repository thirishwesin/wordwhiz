import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Answer } from '../../../core/models/answer';
import { ScrambleHint, ScrambleWord } from '../../../core/models/scramble';

@Component({
  selector: 'app-scramble-word',
  templateUrl: './scramble-word.component.html',
  styleUrls: ['./scramble-word.component.scss']
})
export class ScrambleWordComponent implements OnInit {

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

  constructor() { }

  ngOnInit() {
  }

}
