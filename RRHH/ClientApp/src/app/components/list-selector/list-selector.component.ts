import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { IKeyValue } from '../../models/i-key-value';

@Component({
  selector: 'app-list-selector',
  templateUrl: './list-selector.component.html',
  styleUrls: ['./list-selector.component.scss']
})
export class ListSelectorComponent implements OnInit {

  ITEMS: IKeyValue[] = [];
  FILTERED_DATA: IKeyValue[] = [];
  search = new FormControl();
  checkAll = new FormControl();

  constructor(private dialogRef: MatDialogRef<ListSelectorComponent>,
              @Inject (MAT_DIALOG_DATA) public DATA: IKeyValue[],
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.FILTERED_DATA = this.DATA;
    
    this.checkAll.valueChanges.subscribe(value => {
      this.ITEMS = value ? this.FILTERED_DATA : [];
    });


    this.search.valueChanges.subscribe(value => {
      this.FILTERED_DATA = this.DATA.filter(x=> x.value.toLowerCase().trim().includes(value?.toLowerCase()?.trim()));
    });
  }

  save() {
    if(this.ITEMS.length > 0) {
      this.dialogRef.close(this.ITEMS);
    } else {
      this.dialogService.showSnack("Debes seleccionar por lo menos un elemento");
    }
  }

}
