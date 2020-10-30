import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IAspirant } from 'src/app/models/data/i-aspirant';
import { MainService } from 'src/app/services/main.service';
import { DialogService } from 'src/app/services/dialog.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IDepartment } from 'src/app/models/data/i-department';
import { IPosition } from 'src/app/models/data/i-position';
import { IUser } from 'src/app/models/data/i-user';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/data/department.service';
import { PositionService } from 'src/app/services/data/position.service';
import { LanguageService } from 'src/app/services/data/language.service';
import { ILanguage } from 'src/app/models/data/i-language';
import { SkillService } from 'src/app/services/data/skill.service';
import { CapacitationLevelService } from 'src/app/services/data/capacitation-level.service';
import { ISkill } from 'src/app/models/data/i-skill';
import { ICapacitationLevel } from 'src/app/models/data/i-capacitation-level';
import { ICapacitation } from '../../models/data/i-capacitation';
import { IWorkExperience } from 'src/app/models/data/i-work-experience';
import { Observable, Subscription } from 'rxjs';
import { Role } from 'src/app/models/enums/role';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-aspirant-editor',
  templateUrl: './aspirant-editor.component.html',
  styleUrls: ['./aspirant-editor.component.scss']
})
export class AspirantEditorComponent implements OnInit, OnDestroy {

  @Input() data: IAspirant;
  @Output() close = new EventEmitter<IAspirant>();

  get isEdit(): boolean {
    return this.data.candidatoId > 0;
  }

  selectedIndex = 0;
  filteredCompanies: Observable<string[]>;

  DEPARTMENTS: IDepartment[] = [];
  POSITIONS: IPosition[] = [];
  LANGUAGES: ILanguage[] = [];
  SKILLS: ISkill[] = [];
  CAPACITATIONLEVELS: ICapacitationLevel[] = [];

  loggedUser: IUser;
  onBasicInfoChangeSubscription: Subscription;

  editingWorkExperience: IWorkExperience;
  editingCapacitation: ICapacitation;

  frmBasicInfo = new FormGroup({
    nombre: new FormControl(null, [Validators.required]),
    apellidos: new FormControl(null),
    telefono: new FormControl(null, [Validators.required]),
    cedula: new FormControl(null, [Validators.required]),
    correo: new FormControl(null, [Validators.required, Validators.email]),
    estado: new FormControl(true),
    departamento: new FormControl(null, [Validators.required]),
    puesto: new FormControl(null, [Validators.required]),
    salarioAspira: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  frmLanguage = new FormGroup({
    idioma: new FormControl(null, [Validators.required])
  });

  frmSkill = new FormGroup({
    competencia: new FormControl(null, [Validators.required])
  });

  frmCapacitation = new FormGroup({
    descripcion: new FormControl(null, [Validators.required]),
    nivel: new FormControl(null, [Validators.required]),
    desde: new FormControl(null, [Validators.required]),
    hasta: new FormControl(null),
    institucion: new FormControl(null, [Validators.required])
  });

  frmWorkExperience = new FormGroup({
    empresa: new FormControl(null, [Validators.required]),
    puesto: new FormControl(null, [Validators.required]),
    desde: new FormControl(null, [Validators.required]),
    hasta: new FormControl(null),
    salario: new FormControl(null, [Validators.min(0)]),
  });

  constructor(private mainService: MainService,
    private authService: AuthService,
    private dialogService: DialogService,
    private departmentService: DepartmentService,
    private languageService: LanguageService,
    private positionService: PositionService,
    private skillService: SkillService,
    private capacitationLevelService: CapacitationLevelService,
    private webService: WebService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.LoggedUser;
    this.getPositions();
    this.getLanguages();
    this.getSkills();
    this.getCapacitationLevels();

    this.onBasicInfoChangeSubscription = this.frmBasicInfo.valueChanges.subscribe(x => {
      const frm: IAspirant = this.frmBasicInfo.value;
      this.data.nombre = frm.nombre;
      this.data.apellidos = frm.apellidos;
      this.data.cedula = frm.cedula;
      this.data.correo = frm.correo;
      this.data.telefono = frm.telefono;
      this.data.puesto = frm.puesto;
      this.data.salarioAspira = frm.salarioAspira;
    });

    this.filteredCompanies = this.frmWorkExperience.controls.empresa.valueChanges
    .pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.webService.getCompanyAutocomplete(value))
    );
  }

  ngOnDestroy(): void {
    this.onBasicInfoChangeSubscription?.unsubscribe();
  }

  getDepartments() {
    this.mainService.ShowLoading();
    this.departmentService.GetAll(false).subscribe(response => {
      this.mainService.HideLoading();
      this.DEPARTMENTS = response;
      this.fillUser();
    });
  }

  getPositions() {
    this.mainService.ShowLoading();
    this.positionService.GetAll(false).subscribe(response => {
      this.mainService.HideLoading();
      this.POSITIONS = response;
      this.getDepartments();
    });
  }

  getLanguages() {
    this.mainService.ShowLoading();
    this.languageService.GetAll(false).subscribe(response => {
      this.mainService.HideLoading();
      this.LANGUAGES = response;
    });
  }

  getSkills() {
    this.mainService.ShowLoading();
    this.skillService.GetAll(false).subscribe(response => {
      this.mainService.HideLoading();
      this.SKILLS = response;
    });
  }

  getCapacitationLevels() {
    this.mainService.ShowLoading();
    this.capacitationLevelService.GetAll(false).subscribe(response => {
      this.mainService.HideLoading();
      this.CAPACITATIONLEVELS = response;
    });
  }

  fillUser() {
    this.frmBasicInfo.setValue(
      {
        nombre: this.data.nombre,
        apellidos: this.data.apellidos,
        telefono: this.data.telefono,
        cedula: this.data.cedula,
        correo: this.data.correo,
        estado: this.data.estado,
        departamento: this.DEPARTMENTS.find(x => x.departamentoId == this.data.puesto?.departamento?.departamentoId) ?? {},
        puesto: this.POSITIONS.find(x => x.puestoId == this.data.puesto?.puestoId) ?? {},
        salarioAspira: this.data.salarioAspira,
      }
    );

    this.onDepartmentChange();
  }

  onDepartmentChange() {
    this.POSITIONS = [...this.POSITIONS];
    const department: IDepartment = this.frmBasicInfo.value.departamento;
    if (!department || !this.POSITIONS.find(x => x.departamento.departamentoId == department.departamentoId)) {
      this.frmBasicInfo.controls.puesto.setValue(null);
      this.frmBasicInfo.controls.puesto.disable();
    } else {
      this.frmBasicInfo.controls.puesto.enable();
    }
  }

  addLanguage() {
    this.frmLanguage.markAllAsTouched();
    if (this.frmLanguage.invalid) {
      return;
    }

    let lang: ILanguage = this.frmLanguage.value.idioma;

    if (!this.data.idiomas) {
      this.data.idiomas = [];
    }
    if (this.data.idiomas.find(x => x.idiomaId == lang.idiomaId)) {
      this.dialogService.showSnack("El idioma ya se encuentra agregado");
      return;
    }

    this.frmLanguage.reset();
    this.data.idiomas.push(lang)
  }

  removeLanguage(ind: number) {
    this.data.idiomas.splice(ind, 1);
  }

  addSkill() {
    this.frmSkill.markAllAsTouched();
    if (this.frmSkill.invalid) {
      return;
    }

    const item: ISkill = this.frmSkill.value.competencia;
    if (!this.data.competencias) {
      this.data.competencias = [];
    }
    if (this.data.competencias.find(x => x.competenciaId == item.competenciaId)) {
      this.dialogService.showSnack("La competencia ya se encuentra agregada");
      return;
    }

    this.frmSkill.reset();
    this.data.competencias.push(item)
  }

  removeSkill(ind: number) {
    this.data.competencias.splice(ind, 1);
  }

  validateCapacitationForm(): boolean {
    this.frmCapacitation.markAllAsTouched();
    if (this.frmCapacitation.invalid) {
      return false;
    }

    const item: ICapacitation = this.frmCapacitation.value;

    if (item.hasta && item.desde > item.hasta) {
      this.dialogService.showSnack('La fecha de inicio no puede ser mayor a la fecha de término');
      return false;
    }

    return true;
  }

  addCapacitation() {
    if (this.validateCapacitationForm()) {
      
      if (!this.data.capacitaciones) {
        this.data.capacitaciones = [];
      }

      const item: ICapacitation = this.frmCapacitation.value;
      this.data.capacitaciones.push(item);
      this.frmCapacitation.reset();
    }
  }

  removeCapacitation(ind: number) {
    this.data.capacitaciones.splice(ind, 1);
  }

  openEditCapacitation(cap: ICapacitation) {
    let item = {...cap};
    this.editingCapacitation = cap;
    delete item.capacitacionId;
    this.frmCapacitation.setValue(item);
  }

  editCapacitation() {
    if(this.validateCapacitationForm()) {
      const it = this.data.capacitaciones.findIndex(x=> x == this.editingCapacitation);
      this.data.capacitaciones[it] = this.frmCapacitation.value;
      this.resetCapacitation();
    }
  }

  resetCapacitation() {
    this.editingCapacitation = null;
    this.frmCapacitation.reset();
  }

  validateWorkExperienceForm(): boolean {
    this.frmWorkExperience.markAllAsTouched();
    if (this.frmWorkExperience.invalid) {
      return false;
    }

    const item: IWorkExperience = this.frmWorkExperience.value;
    if (item.hasta && item.desde > item.hasta) {
      this.dialogService.showSnack('La fecha de inicio no puede ser mayor a la fecha de término');
      return false;
    }

    return true;
  }

  addWorkExperience() {
    if (this.validateWorkExperienceForm()) {
      if (!this.data.experienciasLaboral) {
        this.data.experienciasLaboral = [];
      }
      const item: IWorkExperience = this.frmWorkExperience.value;
      this.data.experienciasLaboral.push(item)
      this.frmWorkExperience.reset();
    }
  }

  removeWorkExperience(ind: number) {
    this.data.experienciasLaboral.splice(ind, 1);
  }

  openEditWorkExperience(cap: IWorkExperience) {
    let item = {...cap};
    this.editingWorkExperience = cap;
    delete item.experienciaLaboralId;
    this.frmWorkExperience.setValue(item);
  }

  editWorkExperience() {
    if (this.validateWorkExperienceForm()) {
      const it = this.data.experienciasLaboral.findIndex(x=> x == this.editingWorkExperience);
      this.data.experienciasLaboral[it] = this.frmWorkExperience.value;
      this.resetWorkExperience();
    }
  }

  resetWorkExperience() {
    this.editingWorkExperience = null;
    this.frmWorkExperience.reset();
  }

  validateForm() {
    this.frmBasicInfo.markAllAsTouched();

    if(this.frmBasicInfo.invalid) {
      this.dialogService.showSnack('Algunos campos son inválidos, favor verificar.');
      this.setTabPage(0);
      return false;
    }

    if (!this.frmBasicInfo.value.puesto){
      this.dialogService.showSnack('Debes seleccionar un puesto.');
      this.setTabPage(0);
      return false;
    }

    if (!this.mainService.ValidateCedula(this.frmBasicInfo.value.cedula)) {
      this.dialogService.showSnack('El número de cédula es inválido');
      this.setTabPage(0);
      return false;
    }

    // Extra validations
    if(this.loggedUser.role == Role.Guest) {
      if(!this.data.idiomas || this.data.idiomas.length == 0) {
        this.dialogService.showSnack('Debes agregar por lo menos un idioma.');
        this.setTabPage(1);
        return false;
      }

      if(!this.data.competencias || this.data.competencias.length == 0) {
        this.dialogService.showSnack('Debes agregar por lo menos una competencia');
        this.setTabPage(2);
        return false;
      }
    }

      //const position: IPosition = this.frmBasicInfo.value.puesto;
      //const salary = this.frmBasicInfo.value.salarioAspira;
      // if (salary < position.salarioMinimo || salary > position.salarioMaximo) {
      //   this.dialogService.showSnack(`Lo sentimos, el salario a que usted aspira no se encuentra dentro del rango que tenemos disponible para este puesto. (${position.salarioMinimo} - ${position.salarioMaximo})`, 8000);
      //   this.setTabPage(0);
      //   return false;
      // }

    return true;
  }

  create() {
    this.edit();
  }

  edit() {
    if(this.validateForm()) {
      this.dialogService.confirm('¿Seguro que deseas guardar los cambios?').afterClosed().subscribe(x=> {
        if (x) {
          this.close.emit(this.data);
        }
      });
     }
  }

  setTabPage(page: number): void {
    this.selectedIndex = page;
  }
}
