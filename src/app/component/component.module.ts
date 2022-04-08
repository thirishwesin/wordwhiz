import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MainTitleComponent } from "./main-title/main-title.component";
import { TimerComponent } from "./timer/timer.component";
import { ScrambleWordLogicComponent } from "./scramble-word/scramble-word-logic/scramble-word-logic.component";
import { ScrambleWordControlComponent } from "./scramble-word/scramble-word-control/scramble-word-control.component";
import { ScrambleWordAdminComponent } from "./scramble-word/scramble-word-admin/scramble-word-admin.component";

@NgModule({
    declarations: [
        MainTitleComponent,
        TimerComponent,
        ScrambleWordLogicComponent,
        ScrambleWordControlComponent,
        ScrambleWordAdminComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [
        MainTitleComponent,
        TimerComponent,
        ScrambleWordLogicComponent,
        ScrambleWordControlComponent,
        ScrambleWordAdminComponent
    ]
})
export class ComponentModule {}