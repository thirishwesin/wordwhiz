import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OneThirdScreenComponent } from "./oneThirdScreen.component";
import { HomeRoutingModule } from "../home-routing.module";

@NgModule({
  declarations: [OneThirdScreenComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class OneThirdScreenModule {}
