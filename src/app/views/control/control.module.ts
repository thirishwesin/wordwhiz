import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ControlComponent } from "./control.component";
import { HomeRoutingModule } from "../home-routing.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [ControlComponent],
  imports: [CommonModule, HomeRoutingModule,SharedModule],
})
export class ControlModule {}
