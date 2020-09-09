import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreatedComponent } from './user-created.component';

const routes: Routes = [
  {
    path: '',
    component: UserCreatedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserCreatedRoutingModule { }
