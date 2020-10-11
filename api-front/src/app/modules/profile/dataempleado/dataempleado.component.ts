import { Component, OnInit,HostBinding, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { Solicitud } from '../../../api/models/all';
import { Empleado } from '../../../api/models/all';
import { User } from '../../../api/models/all';

@Component({
  selector: 'app-dataempleado',
  templateUrl: './dataempleado.component.html',
  styleUrls: ['./dataempleado.component.scss']
})
export class DataempleadoComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Empleado', 'Fecha solicitud', 'Inicio vacaciones',
  'Fin vacaciones', 'Estado'];
  dataSource;

  solicitudes: Observable<Solicitud[]>;
  empleado: User = new User();

  DataEmpleado;
  DataCargo = <any>{};
  DataOficina = <any>{};

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadData()
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
        this.dataSource = new MatTableDataSource(this.DataEmpleado.solicitud);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log(error)
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
