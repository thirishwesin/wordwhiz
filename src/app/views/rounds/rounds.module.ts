import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundFiveComponent } from './round-five/round-five.component';
import { ScrambledWordComponent } from './scrambled-word/scrambled-word.component';



@NgModule({
  declarations: [RoundFiveComponent, ScrambledWordComponent],
  imports: [
    CommonModule
  ],
  exports: [RoundFiveComponent, ScrambledWordComponent]
})
export class RoundsModule { }
