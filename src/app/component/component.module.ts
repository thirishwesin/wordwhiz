import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { MainTitleComponent } from "./main-title/main-title.component";
import { TimerComponent } from "./timer/timer.component";
import { ScrambleWordLogicComponent } from "./scramble-word/scramble-word-logic/scramble-word-logic.component";
import { ScrambleWordControlComponent } from "./scramble-word/scramble-word-control/scramble-word-control.component";
import { ScrambleWordAdminComponent } from "./scramble-word/scramble-word-admin/scramble-word-admin.component";
import { ScrambleWordLogicOnethirdComponent } from './scramble-word/scramble-word-logic-onethird/scramble-word-logic-onethird.component';
import { TypoWordLogicComponent } from './typo-word/typo-word-logic/typo-word-logic.component';
import { TypoWordControlComponent } from './typo-word/typo-word-control/typo-word-control.component';
import { TypoWordAdminComponent } from './typo-word/typo-word-admin/typo-word-admin.component';
import { TypoWordLogicOnethirdComponent } from './typo-word/typo-word-logic-onethird/typo-word-logic-onethird.component';

@NgModule({
    declarations: [
        MainTitleComponent,
        TimerComponent,
        ScrambleWordLogicComponent,
        ScrambleWordControlComponent,
        ScrambleWordAdminComponent,
        ScrambleWordLogicOnethirdComponent,
        TypoWordLogicComponent,
        TypoWordControlComponent,
        TypoWordAdminComponent,
        TypoWordLogicOnethirdComponent
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
        ScrambleWordLogicOnethirdComponent,
        TypoWordLogicComponent,
        TypoWordControlComponent,
        TypoWordAdminComponent,
        TypoWordLogicOnethirdComponent
    ]
})
export class ComponentModule {}