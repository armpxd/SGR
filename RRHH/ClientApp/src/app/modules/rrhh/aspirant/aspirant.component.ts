import { Component, OnInit } from '@angular/core';
import { IAspirant } from 'src/app/models/data/i-aspirant';
import { AspirantService } from 'src/app/services/data/aspirant.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MainService } from 'src/app/services/main.service';
import { AspirantEditorContainerComponent } from 'src/app/components/aspirant-editor-container/aspirant-editor-container.component';
import { IUser } from 'src/app/models/data/i-user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aspirant',
  templateUrl: './aspirant.component.html',
  styleUrls: ['./aspirant.component.scss']
})
export class AspirantComponent implements OnInit {

  TABLEDATA: IAspirant[] = [];
  FILTERED_TABLEDATA: IAspirant[] = [];
  paginatorOptions = { itemsPerPage: 10, currentPage: 0 }
  loggedUser: IUser;

  searchValue = '';
  editing: IAspirant = null;

  constructor(private apiService: AspirantService,
              private dialogService: DialogService,
              private mainService: MainService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.LoggedUser;
    this.getAll();
  }

  getAll() {
    this.mainService.ShowLoading();
    this.apiService.GetAll().subscribe(response => {
      this.mainService.HideLoading();
      this.TABLEDATA = this.FILTERED_TABLEDATA = response;
    });
  }

  search() {
    let text = this.searchValue;
    if (!text) {
      this.FILTERED_TABLEDATA = this.TABLEDATA;
    } else {
      text = text.toLocaleLowerCase();
      this.paginatorOptions.currentPage = 0;
      this.FILTERED_TABLEDATA = this.TABLEDATA
        .filter(x => 
          this.mainService.ContainsNormalize(x.nombre,text) ||
          this.mainService.ContainsNormalize(x.apellidos, text) ||
          this.mainService.ContainsNormalize(x.cedula, text) ||
          this.mainService.ContainsNormalize(x.correo, text) ||
          this.mainService.ContainsNormalize(x.telefono, text) ||
          this.mainService.ContainsNormalize(x.puesto?.departamento?.descripcion, text) ||
          this.mainService.ContainsNormalize(x.puesto?.descripcion, text) ||
          x.salarioAspira?.toString()?.toLowerCase()?.includes(text));
    }
  }

  delete(data: IAspirant) {
    this.dialogService.confirm('¿Eliminar este candidato?').afterClosed().subscribe(x => {
      if (x) {
        this.mainService.ShowLoading();
        this.apiService.Delete(data.candidatoId).subscribe(response => {
          this.mainService.HideLoading();
          if (response) {
            this.dialogService.showSnack('Candidato eliminado');
            this.getAll();
          } else {
            this.dialogService.showSnack('No se ha podido eliminar el candidato. Intende de nuevo más tarde');
          }
        });
      }
    });
  }

  openEdit(data: IAspirant) {

    this.mainService.ShowLoading();
    this.apiService.Get(data.candidatoId).subscribe(response => {
      this.mainService.HideLoading();
      this.dialogService.openDialog(AspirantEditorContainerComponent, {
        data: response,
        height: 'auto',
        maxHeight: '95%',
        width: '95%',
        closeOnNavigation: true,
        disableClose: false,
        hasBackdrop: true
      }).afterClosed().subscribe(x => {
        if (x) {
          this.mainService.ShowLoading();
          this.apiService.Update(x).subscribe(response => {
            this.mainService.HideLoading();
            if (response) {
              this.dialogService.showSnack('Datos guardados correctamente');
              this.getAll();
            } else {
              this.dialogService.showSnack('No se han podido guardar los datos');
            }
          });
        }
      });
    });
  }

  hire(data: IAspirant) {
    this.dialogService.confirm('¿Seguro que deseas contratar a este candidato?')
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.mainService.ShowLoading();
          this.apiService.Hire({ candidatoId: data.candidatoId }).subscribe(response => {
            this.mainService.HideLoading();
            if (response) {
              this.dialogService.showSnack('Candidato contratado. Ahora lo puedes ver en la sección de empleados', 5000);
              this.getAll();
            } else {
              this.dialogService.showSnack('No se puede contratar el candidato. Es posible que ya exista un empleado activo con sus datos.', 5000);
            }
          });
        }
      });
  }

}
