import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Control } from '../../../core/models/control';
import { Question } from '../../../core/models/question';
import { Round } from '../../../core/models/round';
import { ScreenType } from '../../../core/models/screenType';
import { TimerEnum } from '../../../core/models/timerEnum';

@Component({
  selector: 'app-scrambled-word',
  templateUrl: './scrambled-word.component.html',
  styleUrls: ['./scrambled-word.component.scss']
})
export class ScrambledWordComponent implements OnInit, OnChanges {

  @Input() control: Control
  @Input() currentQuestion: Question
  @Input() currentRound: Round
  @Input() screenType: ScreenType

  blockAnimated: boolean = false
  round4hintAnimated: boolean = false
  ansCharacterArr: string[]

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.control = changes['control'].currentValue;
    this.updateAnimationValue();
  }

  ngOnInit() {
     this.ansCharacterArr = this.currentQuestion.ans.split('');  // split answer by each character
  }

  updateAnimationValue(): void {
    //animation
    if (this.control.startCount == TimerEnum.START ||this.control.showAns || this.control.clickExtraKey) {
      this.blockAnimated = true;
    }
    // animation
    if (this.control.startCount  == TimerEnum.STOP && !this.control.showAns && !this.control.showQuestion)
      this.blockAnimated = false;
  }

   // get screen type from ScreenType Enum Class
  get screenTypeEnum(): typeof ScreenType {
    return ScreenType;
  }

  get timerEnum(): typeof TimerEnum {
    return TimerEnum;
  }

}
