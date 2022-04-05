import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [ControlComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class ControlModule { }
