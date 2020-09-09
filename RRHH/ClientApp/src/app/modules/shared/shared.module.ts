import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TitlebarComponent } from '../../components/titlebar/titlebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoadingPageComponent } from '../../components/loading-page/loading-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { RouterModule } from '@angular/router';
import { PageComponent } from '../../components/page/page.component';
import { StatePipe } from '../../pipes/state.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NivelriesgoPipe } from 'src/app/pipes/nivelriesgo.pipe';
import { RolePipe } from '../../pipes/role.pipe';
import { DescriptionPipe } from '../../pipes/description.pipe';
import { DepartmentPipe } from '../../pipes/department.pipe';

@NgModule({
  declarations: [
    TitlebarComponent,
    LoadingPageComponent,
    SideMenuComponent,
    ConfirmComponent,
    PageComponent,
    StatePipe,
    NivelriesgoPipe,
    RolePipe,
    DescriptionPipe,
    DepartmentPipe
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatSnackBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    RouterModule,
    NgxPaginationModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule
  ],
  exports: [
    TitlebarComponent,
    LoadingPageComponent,
    SideMenuComponent,
    ConfirmComponent,
    PageComponent,
    StatePipe,
    NivelriesgoPipe,
    RolePipe,
    DescriptionPipe,
    DepartmentPipe
  ]
})
export class SharedModule { }
