import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-missing-word-logic',
  templateUrl: './missing-word-logic.component.html',
  styleUrls: ['./missing-word-logic.component.scss']
})
export class MissingWordLogicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(80,80,60);
  }
  
  font_size(missing_q_block_f,missing_a_block_f,q_lbl_f) {
    document.documentElement.style.setProperty("--missing-q-block-font-size", missing_q_block_f+"px");
    document.documentElement.style.setProperty("--missing-a-block-font-size", missing_a_block_f+"px");
    document.documentElement.style.setProperty("--q-lbl-font-size", q_lbl_f+"px");
  }
}
