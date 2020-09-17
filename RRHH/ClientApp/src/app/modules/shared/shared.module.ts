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
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
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
import { AspirantEditorComponent } from '../../components/aspirant-editor/aspirant-editor.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AspirantEditorContainerComponent } from '../../components/aspirant-editor-container/aspirant-editor-container.component';

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
    DepartmentPipe,
    AspirantEditorComponent,
    AspirantEditorContainerComponent
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule
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
    DepartmentPipe,
    AspirantEditorComponent
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class SharedModule { }
