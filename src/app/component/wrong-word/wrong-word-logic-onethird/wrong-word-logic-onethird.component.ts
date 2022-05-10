import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrong-word-logic-onethird',
  templateUrl: './wrong-word-logic-onethird.component.html',
  styleUrls: ['./wrong-word-logic-onethird.component.scss']
})
export class WrongWordLogicOnethirdComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.font_size(45,55);
  }
  font_size(ww_question_font_value,ww_ans_text_font_value) {
    document.documentElement.style.setProperty("--ww-question-font-size", ww_question_font_value+"px");
    document.documentElement.style.setProperty("--ww-ans-text-font-size", ww_ans_text_font_value+"px");
  }
}
