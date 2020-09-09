import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog) { }

  showSnack(message: string, duration: number = 3000) {
    return this.snackBar.open(message, 'Cerrar', {duration});
  }

  openDialog(component: ComponentType<any>, data: any = null) {
    const dialogRef = this.dialog.open(component, {
      data
    });
    return dialogRef;
  }

  confirm(message: string) {
    return this.openDialog(ConfirmComponent, message );
  }

}
