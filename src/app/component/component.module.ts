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
import { CrossWordLogicComponent } from './cross-word/cross-word-logic/cross-word-logic.component';
import { CrossWordLogicOnethirdComponent } from './cross-word/cross-word-logic-onethird/cross-word-logic-onethird.component';
import { CrossWordAdminComponent } from './cross-word/cross-word-admin/cross-word-admin.component';
import { CrossWordControlComponent } from './cross-word/cross-word-control/cross-word-control.component';
import { WrongWordAdminComponent } from './wrong-word/wrong-word-admin/wrong-word-admin.component';
import { WrongWordControlComponent } from './wrong-word/wrong-word-control/wrong-word-control.component';
import { WrongWordLogicComponent } from './wrong-word/wrong-word-logic/wrong-word-logic.component';
import { WrongWordLogicOnethirdComponent } from './wrong-word/wrong-word-logic-onethird/wrong-word-logic-onethird.component';
import { VideoWordLogicComponent } from './video-word/video-word-logic/video-word-logic.component';
import { VideoWordLogicOnethirdComponent } from './video-word/video-word-logic-onethird/video-word-logic-onethird.component';
import { VideoWordAdminComponent } from './video-word/video-word-admin/video-word-admin.component';
import { VideoWordControlComponent } from './video-word/video-word-control/video-word-control.component';

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
        TypoWordLogicOnethirdComponent,
        CrossWordLogicComponent,
        CrossWordLogicOnethirdComponent,
        CrossWordAdminComponent,
        CrossWordControlComponent,
        WrongWordAdminComponent,
        WrongWordControlComponent,
        WrongWordLogicComponent,
        WrongWordLogicOnethirdComponent,
        VideoWordLogicComponent,
        VideoWordLogicOnethirdComponent,
        VideoWordAdminComponent,
        VideoWordControlComponent
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
        TypoWordLogicOnethirdComponent,
        CrossWordLogicComponent,
        CrossWordLogicOnethirdComponent,
        CrossWordAdminComponent,
        CrossWordControlComponent,
        WrongWordAdminComponent,
        WrongWordControlComponent,
        WrongWordLogicComponent,
        WrongWordLogicOnethirdComponent,
        VideoWordLogicComponent,
        VideoWordLogicOnethirdComponent,
        VideoWordAdminComponent,
        VideoWordControlComponent
    ]
})
export class ComponentModule {}
