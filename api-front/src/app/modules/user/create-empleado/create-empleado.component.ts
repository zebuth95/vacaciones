import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { User } from '../../../api/models/all';
import { Cargo } from '../../../api/models/all';
import { Empleado } from '../../../api/models/all';
import { Oficina } from '../../../api/models/all';

import * as moment from 'moment';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const ISO_FORMAT = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ],
})
export class CreateEmpleadoComponent implements OnInit {

  empleado: User = new User ();

  cargos: Observable<Cargo[]>;
  oficinas: Observable<Oficina[]>;

  selectedCargo: Cargo = new Cargo();
  selectedOficina: Oficina = new Oficina();

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
    this.loadOficinas();
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

  loadOficinas(){
    this.apiService.getOficinas().subscribe(
      data => {
        this.oficinas = data;
        console.log(this.oficinas)
      },
      error => console.log("Failed:  " + error)
    );
  }

  postData() {
    this.empleado.empleados = {};
    this.empleado.empleados.periodos_causados = this.periodos;
    this.empleado.empleados.fecha_ingreso = moment(this.fecha_ingreso).format('YYYY-MM-DD');
    this.empleado.empleados.oficina = this.selectedOficina.id;
    this.empleado.empleados.cargo = this.selectedCargo.id;
    console.log(this.empleado);
    this.apiService.createUserEmpleado(this.empleado).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot save! " + error)
    );
  }
}
