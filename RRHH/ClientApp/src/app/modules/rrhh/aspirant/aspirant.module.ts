import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AspirantRoutingModule } from './aspirant-routing.module';
import { AspirantComponent } from './aspirant.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [AspirantComponent],
  imports: [
    CommonModule,
    AspirantRoutingModule,
    SharedModule
  ]
})
export class AspirantModule { }
