import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cross-word-logic-onethird',
  templateUrl: './cross-word-logic-onethird.component.html',
  styleUrls: ['./cross-word-logic-onethird.component.scss']
})
export class CrossWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.font_size(90,55,45);
  }
  font_size(header_font_value,question_font_value,alphatext_font_value) {
    document.documentElement.style.setProperty("--round-header-font-size", header_font_value+"px");
    document.documentElement.style.setProperty("--question-font-size", question_font_value+"px");
    document.documentElement.style.setProperty("--alphatext-font-size", alphatext_font_value+"px");
  }
}