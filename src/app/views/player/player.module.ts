import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PlayerComponent } from "./player.component";
import { HomeRoutingModule } from "../home-routing.module";

@NgModule({
  declarations: [PlayerComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class PlayerModule { }
