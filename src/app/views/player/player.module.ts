import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerComponent } from "./player.component";
import { HomeRoutingModule } from "../home-routing.module";
import { TypoWordComponent } from './typo-word/typo-word.component';
import { ScrambleWordComponent } from "./scramble-word/scramble-word.component";

@NgModule({
  declarations: [PlayerComponent, TypoWordComponent, ScrambleWordComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class PlayerModule { }
