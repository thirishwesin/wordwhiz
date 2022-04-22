import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';
import { ComponentModule } from '../../component/component.module';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule,ComponentModule
  ]
})
export class AdminModule { }
