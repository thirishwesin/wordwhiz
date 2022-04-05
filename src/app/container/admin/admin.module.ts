import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class AdminModule { }
