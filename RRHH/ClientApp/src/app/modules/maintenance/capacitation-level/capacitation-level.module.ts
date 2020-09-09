import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapacitationLevelRoutingModule } from './capacitation-level-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapacitationLevelComponent } from './capacitation-level.component';

@NgModule({
  declarations: [CapacitationLevelComponent],
  imports: [
    CommonModule,
    CapacitationLevelRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class CapacitationLevelModule { }
