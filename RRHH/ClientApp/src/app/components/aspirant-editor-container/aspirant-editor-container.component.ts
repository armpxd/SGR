import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAspirant } from 'src/app/models/data/i-aspirant';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-aspirant-editor-container',
  templateUrl: './aspirant-editor-container.component.html',
  styleUrls: ['./aspirant-editor-container.component.scss']
})
export class AspirantEditorContainerComponent implements OnInit {

  backupData: IAspirant;

  constructor(public dialogRef: MatDialogRef<AspirantEditorContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAspirant,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.backupData = {...this.data};
  }

  onInformationChange(event: IAspirant) {
    if(event.candidatoId > 0) {
      this.dialogRef.close(event);
    } else {
      this.dialogService.showSnack('Candidato inválido');
    }
  }

  cancel() {
    this.data = this.backupData;
    this.dialogRef.close(false);
  }

}
