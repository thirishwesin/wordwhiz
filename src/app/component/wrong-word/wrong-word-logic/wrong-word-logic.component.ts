import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wrong-word-logic',
  templateUrl: './wrong-word-logic.component.html',
  styleUrls: ['./wrong-word-logic.component.scss']
})
export class WrongWordLogicComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.font_size(60,80);
  }
  font_size(ww_question_font_value,ww_ans_text_font_value) {
    document.documentElement.style.setProperty("--ww-question-font-size", ww_question_font_value+"px");
    document.documentElement.style.setProperty("--ww-ans-text-font-size", ww_ans_text_font_value+"px");
  }
}
