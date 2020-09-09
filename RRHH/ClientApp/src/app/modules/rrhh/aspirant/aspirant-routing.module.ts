import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspirantComponent } from './aspirant.component';

const routes: Routes = [{
  path: '',
  component: AspirantComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AspirantRoutingModule { }
