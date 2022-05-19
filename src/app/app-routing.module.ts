import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestingComponent } from './component/testing/testing.component';
import { ContainerRoutingModule } from './container/container-routing.module';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'testing',
    component: TestingComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ContainerRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
