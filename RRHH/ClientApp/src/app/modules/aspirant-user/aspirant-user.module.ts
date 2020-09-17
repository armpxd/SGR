import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AspirantUserRoutingModule } from './aspirant-user-routing.module';
import { AspirantUserComponent } from './aspirant-user.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [AspirantUserComponent],
  imports: [
    CommonModule,
    AspirantUserRoutingModule,
    SharedModule,
    MatButtonModule
  ]
})
export class AspirantUserModule { }
