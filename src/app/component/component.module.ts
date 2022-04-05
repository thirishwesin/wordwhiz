import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MainTitleComponent } from "./main-title/main-title.component";
import { ScrambleWordComponent } from "./scramble-word/scramble-word.component";
import { TimerComponent } from "./timer/timer.component";

@NgModule({
    declarations: [
        MainTitleComponent,
        TimerComponent,
        ScrambleWordComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ComponentModule {}