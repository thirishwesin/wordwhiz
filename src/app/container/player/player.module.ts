import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class PlayerModule { }
