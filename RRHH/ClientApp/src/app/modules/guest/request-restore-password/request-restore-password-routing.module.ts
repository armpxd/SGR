import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestRestorePasswordComponent } from './request-restore-password.component'

const routes: Routes = [
  {
    path: '',
    component: RequestRestorePasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestRestorePasswordRoutingModule { }
