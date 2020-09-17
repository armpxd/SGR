import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestorepasswordComponent } from './restorepassword.component';

const routes: Routes = [
  {
    path: '',
    component: RestorepasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestorepasswordRoutingModule { }
