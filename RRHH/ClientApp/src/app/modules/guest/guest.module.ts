import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserCreatedComponent } from './user-created/user-created.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RequestRestorePasswordComponent } from './request-restore-password/request-restore-password.component';


@NgModule({
  declarations: [UserCreatedComponent, RequestRestorePasswordComponent],
  imports: [
    CommonModule,
    GuestRoutingModule,
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
export class GuestModule { }
