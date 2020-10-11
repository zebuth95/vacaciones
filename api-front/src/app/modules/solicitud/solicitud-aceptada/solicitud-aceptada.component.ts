import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
//Added
import { ApiService } from '../../../api/service/api.service';
import { MatTableDataSource } from '@angular/material/table';
//added
//Model
import { Solicitud } from '../../../api/models/all';
//try
import { MatPaginator } from '@angular/material/paginator';
// SweetAlert
import swal from'sweetalert2';

@Component({
  selector: 'app-solicitud-aceptada',
  templateUrl: './solicitud-aceptada.component.html',
  styleUrls: ['./solicitud-aceptada.component.scss']
})
export class SolicitudAceptadaComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Usuario', 'Fecha solicitud', 'Inicio vacaciones',
  'Fin vacaciones', 'Edit', 'Cancelar'];
  dataSource;

  solicitudes: any = [];

  //SweetAlert
  Alerta: string='';

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
    this.loadData();
  }

  loadData() {
    this.apiService.getSolicitudesAceptadas().subscribe(
      (data: Solicitud[]) => {
        this.solicitudes = data;
        //this.dataSource.paginator = this.paginator;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      err => console.log(err),
    );
  }

  CancelarProduct(id: number) {
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
          title: 'Cancelado!',
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
