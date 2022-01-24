import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { MainComponent } from "./main/main.component";
import { ControlComponent } from "./control/control.component";
import { SetupComponent } from "./setup/setup.component";
import { PlayerComponent } from "./player/player.component";
import { OneThirdScreenComponent } from "./oneThirdScreen/oneThirdScreen.component";
import { SpinnerWheelComponent } from "./spinner-wheel/spinner-wheel.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "main", component: MainComponent },
  { path: "oneThird", component: OneThirdScreenComponent },
  { path: "control", component: ControlComponent },
  { path: "setup", component: SetupComponent },
  { path: "player", component: PlayerComponent },
  { path: "spinner-wheel", component: SpinnerWheelComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
