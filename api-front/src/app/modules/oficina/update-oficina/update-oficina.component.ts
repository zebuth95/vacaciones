import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { Oficina } from '../../../api/models/all';
import { Ciudad } from '../../../api/models/all';

@Component({
  selector: 'app-update-oficina',
  templateUrl: './update-oficina.component.html',
  styleUrls: ['./update-oficina.component.scss']
})
export class UpdateOficinaComponent implements OnInit {

  oficina: Oficina = new Oficina();
  ciudades: Observable<Ciudad[]>;
  selectedCiudad: Ciudad = new Ciudad();

  DataOficina;
  DataCiudad = <any>{};

  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadData();
    this.loadCiudades();
  }

  loadCiudades(){
    this.apiService.getCiudades().subscribe(
      data => {
        this.ciudades = data;
      },
      error => console.log("Failed:  " + error)
    );
  }

  loadData(){
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getOficina(params.id).subscribe(
        data => {
          this.oficina = data;
          this.LoadAllData(data);
        },
        error => console.log(error)
      );
    }
  }

  LoadAllData(data){
    this.apiService.getOficinaData(data).subscribe(
      res => {
        this.DataOficina = res;
        this.DataCiudad = this.DataOficina.ciudad
      },
      error => console.log(error)
    )
  }

  updateData() {
    this.oficina.ciudad = this.selectedCiudad.id;
    this.apiService.updateOficina(this.oficina.id, this.oficina).subscribe(
      data => {
        this.submit = true;
        this.loadData();
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }

}
