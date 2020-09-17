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
      },
      {
        path: 'cambiarcontrasena',
        loadChildren: () => import('./restorepassword/restorepassword.module').then(m=> m.RestorepasswordModule)
      },
      {
        path: 'recuperarcontrasena',
        loadChildren: () => import('./request-restore-password/request-restore-password.module').then(m=> m.RequestRestorePasswordModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
