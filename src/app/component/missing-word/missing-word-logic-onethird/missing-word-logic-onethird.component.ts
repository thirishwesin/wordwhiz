import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-missing-word-logic-onethird',
  templateUrl: './missing-word-logic-onethird.component.html',
  styleUrls: ['./missing-word-logic-onethird.component.scss']
})
export class MissingWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(80,80,60,60);
  }
  font_size(typo_q_block_f,typo_a_block_f,q_lbl_f,h_lbl_f) {
    document.documentElement.style.setProperty("--typo-q-block-font-size", typo_q_block_f+"px");
    document.documentElement.style.setProperty("--typo-a-block-font-size", typo_a_block_f+"px");
    document.documentElement.style.setProperty("--q-lbl-font-size", q_lbl_f+"px");
    document.documentElement.style.setProperty("--h-lbl-font-size", h_lbl_f+"px");

    // var q_lbl_w = document.getElementById("q-block").offsetWidth;
    // document.documentElement.style.setProperty("--q-lbl-w", q_lbl_w+"px");
  }
}
