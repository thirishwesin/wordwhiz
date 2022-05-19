import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlComponent } from './control.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';
import { ComponentModule } from '../../component/component.module';




@NgModule({
  declarations: [ControlComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule,ComponentModule
  ]
})
export class ControlModule { }
