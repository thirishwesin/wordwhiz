import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OneThirdScreenComponent } from "./oneThirdScreen.component";
import { HomeRoutingModule } from "../home-routing.module";
import { RoundsModule } from "../rounds/rounds.module";

@NgModule({
  declarations: [OneThirdScreenComponent],
  imports: [CommonModule, HomeRoutingModule, RoundsModule],
})
export class OneThirdScreenModule {}
