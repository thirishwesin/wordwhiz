import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typo-word-logic-onethird',
  templateUrl: './typo-word-logic-onethird.component.html',
  styleUrls: ['./typo-word-logic-onethird.component.scss']
})
export class TypoWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(65,65);
  }
  font_size(typo_q_block_f,typo_a_block_f) {
    document.documentElement.style.setProperty("--typo-q-block-font-size", typo_q_block_f+"px");
    document.documentElement.style.setProperty("--typo-a-block-font-size", typo_a_block_f+"px");
  }

}
