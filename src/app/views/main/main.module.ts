import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MainComponent } from "./main.component";
import { HomeRoutingModule } from "../home-routing.module";
import { RoundFiveComponent } from "../rounds/round-five/round-five.component";
import { ScrambledWordComponent } from "../rounds/scrambled-word/scrambled-word.component";

@NgModule({
  declarations: [MainComponent, RoundFiveComponent, ScrambledWordComponent],
  imports: [CommonModule, FormsModule, HomeRoutingModule],
  exports: [MainComponent],
})
export class MainModule {}
