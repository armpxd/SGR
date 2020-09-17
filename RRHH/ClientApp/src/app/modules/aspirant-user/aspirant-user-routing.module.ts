import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AspirantUserComponent } from './aspirant-user.component';

const routes: Routes = [
  {
    path: '',
    component: AspirantUserComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AspirantUserRoutingModule { }
