import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'nuevoingreso',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'nuevoingreso',
        loadChildren: () => import('../report/new-employee/new-employee.module').then(m=> m.NewEmployeeModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
