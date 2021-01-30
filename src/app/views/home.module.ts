import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HomeRoutingModule } from "./home-routing.module";

import { HomeComponent } from "./home.component";
import { SharedModule } from "../shared/shared.module";
import { ControlModule } from "../views/control/control.module";
import { MainModule } from "../views/main/main.module";
import { OneThirdScreenModule } from "./oneThirdScreen/oneThirdScreen.module";
import { SetupModule } from "../views/setup/setup.module";
import { PlayerModule } from "../views/player/player.module";
import { RoundFiveComponent } from './rounds/round-five/round-five.component';

@NgModule({
  declarations: [HomeComponent, RoundFiveComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    ControlModule,
    MainModule,
    OneThirdScreenModule,
    SetupModule,
    PlayerModule,
  ],
})
export class HomeModule {}
