import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SetupComponent } from "./setup.component";
import { HomeRoutingModule } from "../home-routing.module";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [SetupComponent],
  imports: [CommonModule, HomeRoutingModule, SharedModule],
  exports: [],
})
export class SetupModule {}
