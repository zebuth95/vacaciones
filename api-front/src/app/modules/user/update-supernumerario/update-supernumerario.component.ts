import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { SuperEmp } from '../../../api/models/all';
import { Cargo } from '../../../api/models/all';
import { Empleado } from '../../../api/models/all';
import { Ciudad } from '../../../api/models/all';

interface Estado {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-update-supernumerario',
  templateUrl: './update-supernumerario.component.html',
  styleUrls: ['./update-supernumerario.component.scss']
})
export class UpdateSupernumerarioComponent implements OnInit {

  supernumerario: SuperEmp = new SuperEmp();
  selectedCargo;
  selectedCiudad: Ciudad = new Ciudad();
  cargos: Observable<Cargo[]>;
  ciudades: Observable<Ciudad[]>;

  DataSupernumerario;
  DataCargo : Observable<Cargo[]>;
  DataCiudad = <any>{};

  submit = false;

  estados: Estado[] = [
    {value: true, viewValue: 'Activo'},
    {value: false, viewValue: 'No activo'}
  ]

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadData();
    this.loadCargos();
    this.loadCiudades();
  }

  loadData(){
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getUserSupernumerario(params.id).subscribe(
        data => {
          this.supernumerario = data;
          this.LoadAllData(data);
        },
        error => console.log(error)
      );
    }
  }
  LoadAllData(data){
    this.apiService.getEmpleadoData(data).subscribe(
      res => {
        this.DataSupernumerario = res;
        console.log(this.DataSupernumerario);
        this.DataCargo = this.DataSupernumerario.supernumerario.cargo;
        this.DataCiudad = this.DataSupernumerario.supernumerario.ciudad;
      },
      error => console.log(error)
    )
  }

  loadCargos(){
    this.apiService.getCargos().subscribe(
      data => {
        this.cargos = data;
      },
      error => console.log("Failed:  " + error)
    );
  }

  loadCiudades(){
    this.apiService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
      },
      error => console.log("Failed:  " + error)
    );
  }

  updateData() {
    this.supernumerario.empleados = {};
    this.supernumerario.empleados.estado = this.DataSupernumerario.supernumerario.estado;
    this.supernumerario.empleados.ciudad = this.selectedCiudad.id;
    this.supernumerario.empleados.cargo = this.selectedCargo;
    console.log(this.supernumerario);
    this.apiService.updateUserSupernumerario(this.supernumerario.id, this.supernumerario).subscribe(
      data => {
        this.submit = true;
        this.loadData();
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }

}
