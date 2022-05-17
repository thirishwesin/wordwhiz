import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-missing-word-logic-onethird',
  templateUrl: './missing-word-logic-onethird.component.html',
  styleUrls: ['./missing-word-logic-onethird.component.scss']
})
export class MissingWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(80,80);
  }
  font_size(missing_q_block_f,missing_a_block_f) {
    document.documentElement.style.setProperty("--missing-q-block-font-size", missing_q_block_f+"px");
    document.documentElement.style.setProperty("--missing-a-block-font-size", missing_a_block_f+"px");
  }
}
