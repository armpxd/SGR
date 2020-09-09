import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CapacitationLevelComponent } from './capacitation-level.component';

const routes: Routes = [
  {
    path: '',
    component: CapacitationLevelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacitationLevelRoutingModule { }
