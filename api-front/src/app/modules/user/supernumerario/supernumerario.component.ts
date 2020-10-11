import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
//Added
import { ApiService } from '../../../api/service/api.service';
import { MatTableDataSource } from '@angular/material/table';
//added
import { Observable, Observer } from "rxjs";
//Model
import { SuperEmp } from '../../../api/models/all';
//try
import { MatPaginator } from '@angular/material/paginator';
// SweetAlert
import swal from'sweetalert2';

@Component({
  selector: 'app-supernumerario',
  templateUrl: './supernumerario.component.html',
  styleUrls: ['./supernumerario.component.scss']
})
export class SupernumerarioComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns: string[] = ['Código', 'Email', 'Nombre',
  'Apellido', 'Editar', 'Eliminar'];
  dataSource;

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.apiService.getUserSupernumerarios().subscribe(
      data => {
        //this.dataSource.paginator = this.paginator;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log("Failed:  " + error)
    )
  }

  delete(id: number) {
    console.log('Delete post');
    swal.fire({
      heightAuto: false,
      title: 'Estas seguro de eliminar?',
      text: "No podras revertirlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí!',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
          this.deleteData(id);
        {
          console.log('Delete');
          swal.fire({
            heightAuto: false,
            title: 'Eliminado!',
            text: 'El supernumearario ha sido eliminado.',
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
          text: 'La solicitud no ha sido efectuada',
          showConfirmButton: false,
          icon: 'error',
        }),
        this.loadData();
      }
    })
  }

  deleteData(id){
    this.apiService.deleteUserSupernumerario(id).subscribe(
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
