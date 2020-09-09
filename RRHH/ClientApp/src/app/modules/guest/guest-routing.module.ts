import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo:'registration',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'registro',
        loadChildren: () => import('./registration/registration.module').then(m=> m.RegistrationModule)
      },
      {
        path: 'usuariocreado',
        loadChildren: () => import('./user-created/user-created.module').then(m=> m.UserCreatedModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
