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


@Component({
  selector: 'app-update-empleado',
  templateUrl: './update-empleado.component.html',
  styleUrls: ['./update-empleado.component.scss']
})
export class UpdateEmpleadoComponent implements OnInit {

  empleado: User = new User();
  selectedCargo: Cargo = new Cargo();
  selectedOficina: Oficina = new Oficina();
  cargos: Observable<Cargo[]>;
  oficinas: Observable<Oficina[]>;

  DataEmpleado;
  DataIngreso = <any>{};
  DataPeriodo = <any>{};
  DataCargo = <any>{};
  DataOficina = <any>{};

  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadData();
    this.loadCargos();
    this.loadOficinas();
  }

  loadData(){
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getUserEmpleado(params.id).subscribe(
        data => {
          this.empleado = data;
          this.LoadAllData(data);
        },
        error => console.log(error)
      );
    }
  }
  LoadAllData(data){
    console.log(data);
    this.apiService.getEmpleadoData(data).subscribe(
      res => {
        this.DataEmpleado = res;
        this.DataCargo = this.DataEmpleado.empleados.cargo;
        this.DataOficina = this.DataEmpleado.empleados.oficina;
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

  loadOficinas(){
    this.apiService.getOficinas().subscribe(
      data => {
        this.oficinas = data;
      },
      error => console.log("Failed:  " + error)
    );
  }

  updateData() {
    this.empleado.empleados.oficina = this.selectedOficina.id;
    this.empleado.empleados.cargo = this.selectedCargo.id;
    this.apiService.updateUserEmpleado(this.empleado.id, this.empleado).subscribe(
      data => {
        this.submit = true;
        this.loadData();
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }



}
