import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../../api/service/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Observer } from "rxjs";
import { Solicitud } from '../../../api/models/all';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import swal from'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})

export class SolicitudesComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Usuario', 'Fecha solicitud', 'Inicio vacaciones',
  'Fin vacaciones', 'Edit', 'Aceptar', 'Cancelar'];
  dataSource;

  solicitudes: Observable<Solicitud[]>;
  success: boolean = false;
  error = false;
  //SweetAlert
  Alerta: string='';

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getSolicitudesEspera().subscribe(
      data => {
        //this.dataSource.paginator = this.paginator;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log("Failed:  " + error)
    )
  }

  AceptarSolicitud(id: number){
    this.apiService.SolicitudA(id, this.solicitudes).subscribe(
      data => {
        this.SolicitudRespuesta(data.message);
        console.log(data);
        this.loadData();
      },
      error => {
        console.log("Failed:  " + error);
      },
      );
  }

  SolicitudRespuesta(mensaje){
    swal.fire({heightAuto: false,title: mensaje})
  }

  Cancelar(id: number) {
    console.log('Delete post');
    swal.fire({
      heightAuto: false,
      title: 'Estas seguro de cancelar?',
      text: "No podras revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí!',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (
        this.apiService.SolicitudC(id, this.solicitudes).subscribe(
          res => {
            console.log(res);
            this.loadData();
          },
          err => console.log(err)
        )){
          console.log('Delete');
          swal.fire({
            heightAuto: false,
            title: 'Cancelar!',
            text: 'La ha sido cancelada.',
            showConfirmButton: false,
            icon: 'success',
          })
        }
      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
        swal.fire({
          heightAuto: false,
          title: 'No cancelado!',
          text: 'La solicitud no ha sido cancelada.',
          showConfirmButton: false,
          icon: 'error',
        }),
        this.loadData();
      }
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
