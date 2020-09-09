import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateRouteGuard } from './guards/can-activate-route.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
  path: '',
  children: [
    {
      path: 'inicio',
      loadChildren: () => import('./modules/home/home.module').then(m=> m.HomeModule),
      canActivate: [CanActivateRouteGuard]
    },
    {
      path: 'login',
      loadChildren: () => import('./modules/login/login.module').then(m=> m.LoginModule)
    },
    {
      path: 'rrhh',
      loadChildren: () => import('./modules/rrhh/rrhh.module').then(m=> m.RRHHModule),
      canActivate: [CanActivateRouteGuard, RoleGuard]
    },
    {
      path: 'invitado',
      loadChildren: () => import('./modules/guest/guest.module').then(m=> m.GuestModule)
    },
    {
      path: 'admin',
      loadChildren: () => import('./modules/admin/admin.module').then(m=> m.AdminModule),
      canActivate: [CanActivateRouteGuard, RoleGuard]
    },
    {
      path: 'mantenimiento',
      loadChildren: () => import('./modules/maintenance/maintenance.module').then(m=> m.MaintenanceModule),
      canActivate: [CanActivateRouteGuard, RoleGuard]
    },
    {
      path: 'reporte',
      loadChildren: () => import('./modules/report/report.module').then(m=> m.ReportModule),
      canActivate: [CanActivateRouteGuard, RoleGuard]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
