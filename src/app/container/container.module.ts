import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AdminModule } from "./admin/admin.module";
import { ContainerRoutingModule } from "./container-routing.module";
import { ControlModule } from "./control/control.module";
import { HomeModule } from "./home/home.module";
import { MainModule } from "./main/main.module";
import { OneThirdScreenModule } from "./one-third-screen/one-third-screen.module";
import { PlayerModule } from "./player/player.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ContainerRoutingModule,
        AdminModule,
        ControlModule,
        HomeModule,
        MainModule,
        OneThirdScreenModule,
        PlayerModule
    ]
})
export class ContainerModule {}