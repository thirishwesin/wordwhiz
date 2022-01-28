import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-typo-word',
  templateUrl: './typo-word.component.html',
  styleUrls: ['./typo-word.component.scss']
})
export class TypoWordComponent implements OnInit {

  @Input() typoWordImage: any;

  constructor() { }

  ngOnInit() {
  }

}
