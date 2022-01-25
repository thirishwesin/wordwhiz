import { Component, Input, OnInit } from '@angular/core';
import { Control } from '../../../core/models/control';
import { Question } from '../../../core/models/question';
import { Round } from '../../../core/models/round';
import { ScreenType } from '../../../core/models/screenType';

@Component({
  selector: 'app-scrambled-word',
  templateUrl: './scrambled-word.component.html',
  styleUrls: ['./scrambled-word.component.scss']
})
export class ScrambledWordComponent implements OnInit {

  @Input() control: Control
  @Input() currentQuestion: Question
  @Input() currentRound: Round
  @Input() screenType: ScreenType

  blockAnimated: boolean = false
  round4hintAnimated : boolean = false


  constructor() { }

  ngOnInit() {
    console.log("control: ", this.control)
    console.log("currentQuestion: ", this.currentQuestion)
    console.log("contcurrentRoundrol: ", this.currentRound)
    console.log("screenType: ", this.screenType)

    //animation
    if (
      this.control.startCount ||
      this.control.showAns ||
      this.control.clickExtraKey
    ) {
      this.blockAnimated = true;
    }
    // animation
    if (
      !this.control.startCount &&
      !this.control.showAns &&
      !this.control.showQuestion
    )
      this.blockAnimated = false;

  }

   // get screen type from ScreenType Enum Class
   get screenTypeEnum(): typeof ScreenType {
    return ScreenType;
  }


}
