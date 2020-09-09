import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'empleados',
    pathMatch: 'full'
  },
  {
  path: '',
  children: [
    {
      path: 'empleados',
      loadChildren: ()=> import('./employee/employee.module').then(m=> m.EmployeeModule)
    },
    {
      path: 'candidatos',
      loadChildren: ()=> import('./aspirant/aspirant.module').then(m=> m.AspirantModule)
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RRHHRoutingModule { }
