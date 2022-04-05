import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { ContainerRoutingModule } from '../container-routing.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, SharedModule, ContainerRoutingModule]
})
export class HomeModule {}
