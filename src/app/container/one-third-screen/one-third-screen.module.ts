import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OneThirdScreenComponent } from './one-third-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';



@NgModule({
  declarations: [OneThirdScreenComponent],
  imports: [
    CommonModule, SharedModule, ContainerRoutingModule
  ]
})
export class OneThirdScreenModule { }
