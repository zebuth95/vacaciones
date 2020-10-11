import { Component, OnInit,HostBinding, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { SuperEmp } from '../../../api/models/all';
import { Cargo } from '../../../api/models/all';
import { Historico } from '../../../api/models/all';

@Component({
  selector: 'app-datasupernumerario',
  templateUrl: './datasupernumerario.component.html',
  styleUrls: ['./datasupernumerario.component.scss']
})
export class DatasupernumerarioComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Solicitud', 'Supernumerario', 'Oficina',
  'Cargo', 'Empalme incio', 'Empalme fin', 'Fecha Confirmacion'];
  dataSource;

  historicos: Observable<Historico[]>;
  supernumerario: SuperEmp = new SuperEmp();

  DataSupernumerario;
  DataCargo : Observable<Cargo[]>;
  DataCiudad = <any>{};

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadData();
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
        this.DataCargo = this.DataSupernumerario.supernumerario.cargo;
        this.DataCiudad = this.DataSupernumerario.supernumerario.ciudad;
        this.dataSource = new MatTableDataSource(this.DataSupernumerario.historico);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log(error)
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
