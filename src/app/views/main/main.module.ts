import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MainComponent } from "./main.component";
import { HomeRoutingModule } from "../home-routing.module";
import { RoundsModule } from "../rounds/rounds.module";

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, FormsModule, HomeRoutingModule, RoundsModule],
  exports: [MainComponent],
})
export class MainModule {}
