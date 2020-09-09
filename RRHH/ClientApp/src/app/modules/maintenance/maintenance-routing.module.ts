import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'departamentos',
    pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'competencias',
        loadChildren: () => import('../maintenance/skills/skills.module').then(m=> m.SkillsModule)
      },
      {
        path: 'departamentos',
        loadChildren: () => import('../maintenance/departments/departments.module').then(m=> m.DepartmentsModule)
      },
      {
        path: 'idiomas',
        loadChildren: () => import('../maintenance/languages/languages.module').then(m=> m.LanguagesModule)
      },
      {
        path: 'puestos',
        loadChildren: () => import('../maintenance/positions/positions.module').then(m=> m.PositionsModule)
      },
      {
        path: 'nivelescapacitacion',
        loadChildren: () => import('../maintenance/capacitation-level/capacitation-level.module').then(m=> m.CapacitationLevelModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
