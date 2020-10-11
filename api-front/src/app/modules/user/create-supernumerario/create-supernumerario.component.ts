import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { SuperEmp } from '../../../api/models/all';
import { Cargo } from '../../../api/models/all';
import { Ciudad } from '../../../api/models/all';


@Component({
  selector: 'app-create-supernumerario',
  templateUrl: './create-supernumerario.component.html',
  styleUrls: ['./create-supernumerario.component.scss']
})
export class CreateSupernumerarioComponent implements OnInit {

  supernumerario: SuperEmp = new SuperEmp ();

  cargos: Observable<Cargo[]>;
  ciudades: Observable<Ciudad[]>;

  selectedCargo;
  selectedCiudad: Ciudad = new Ciudad();

  selectedCargoS: number;
  selectedOficinaS: number;

  fecha_ingreso;
  periodos;

  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCargos();
    this.loadCiudades();
  }

  loadCargos(){
    this.apiService.getCargos().subscribe(
      data => {
        this.cargos = data;
        console.log(this.cargos)
      },
      error => console.log("Failed:  " + error)
    );
  }

  loadCiudades(){
    this.apiService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
        console.log(this.ciudades)
      },
      error => console.log("Failed:  " + error)
    );
  }

  postData() {
    this.supernumerario.empleados = {};
    this.supernumerario.empleados.ciudad = this.selectedCiudad.id;
    this.supernumerario.empleados.cargo = this.selectedCargo;
    console.log(this.supernumerario);
    this.apiService.createUserSupernumerario(this.supernumerario).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }

}
