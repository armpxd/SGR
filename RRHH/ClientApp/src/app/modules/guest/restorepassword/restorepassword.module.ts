import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestorepasswordRoutingModule } from './restorepassword-routing.module';
import { RestorepasswordComponent } from './restorepassword.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [RestorepasswordComponent],
  imports: [
    CommonModule,
    RestorepasswordRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class RestorepasswordModule { }
