import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MainTitleComponent } from "./main-title/main-title.component";
import { TimerComponent } from "./timer/timer.component";
import { ScrambleWordLogicComponent } from "./scramble-word/scramble-word-logic/scramble-word-logic.component";
import { ScrambleWordControlComponent } from "./scramble-word/scramble-word-control/scramble-word-control.component";
import { ScrambleWordAdminComponent } from "./scramble-word/scramble-word-admin/scramble-word-admin.component";
import { TypoWordLogicComponent } from './typo-word/typo-word-logic/typo-word-logic.component';
import { TypoWordControlComponent } from './typo-word/typo-word-control/typo-word-control.component';
import { TypoWordAdminComponent } from './typo-word/typo-word-admin/typo-word-admin.component';

@NgModule({
    declarations: [
        MainTitleComponent,
        TimerComponent,
        ScrambleWordLogicComponent,
        ScrambleWordControlComponent,
        ScrambleWordAdminComponent,
        TypoWordLogicComponent,
        TypoWordControlComponent,
        TypoWordAdminComponent
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
        ScrambleWordAdminComponent,
        TypoWordLogicComponent,
        TypoWordControlComponent,
        TypoWordAdminComponent
    ]
})
export class ComponentModule {}