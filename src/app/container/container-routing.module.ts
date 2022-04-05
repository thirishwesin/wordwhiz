import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ControlComponent } from './control/control.component';
import { MainComponent } from './main/main.component';
import { OneThirdScreenComponent } from './one-third-screen/one-third-screen.component';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'control', component: ControlComponent},
  { path: 'main', component: MainComponent},
  { path: 'one-third-screen', component: OneThirdScreenComponent},
  { path: 'player', component: PlayerComponent }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule {}
