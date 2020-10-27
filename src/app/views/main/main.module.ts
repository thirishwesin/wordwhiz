import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MainComponent } from "./main.component";
import { HomeRoutingModule } from "../home-routing.module";

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, FormsModule, HomeRoutingModule],
  exports: [MainComponent],
})
export class MainModule {}
