import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class MainModule { }
