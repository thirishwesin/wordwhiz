import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scramble-word-logic',
  templateUrl: './scramble-word-logic.component.html',
  styleUrls: ['./scramble-word-logic.component.scss']
})
export class ScrambleWordLogicComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(100);
  }
  font_size(scramble_block_f) {
    document.documentElement.style.setProperty("--scramble-block-font-size", scramble_block_f+"px");
  }

}
