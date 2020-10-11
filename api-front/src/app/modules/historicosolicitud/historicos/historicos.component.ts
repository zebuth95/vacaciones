import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
//Added
import { ApiService } from '../../../api/service/api.service';
import { MatTableDataSource } from '@angular/material/table';
//added
import { Observable, Observer } from "rxjs";
//Model
import { Historico } from '../../../api/models/all';
//try
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-historicos',
  templateUrl: './historicos.component.html',
  styleUrls: ['./historicos.component.scss']
})
export class HistoricosComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Solicitud', 'Supernumerario', 'Oficina',
  'Cargo', 'Empalme incio', 'Empalme fin', 'Fecha Confirmacion', 'Editar', 'Cancelar'];
  dataSource;

  historicos: Observable<Historico[]>;

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getHistoricoSolicitudes().subscribe(
       data => {
        //this.dataSource.paginator = this.paginator;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log("Failed:  " + error)
    )
  }

  deleteData(id, data){
    this.apiService.deleteHistoricoSolicitud(id, data).subscribe(
          data => {
            this.loadData();
          },
          error => console.log("Failed:  " + error)
        )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
