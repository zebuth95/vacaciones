import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { Oficina } from '../../../api/models/all';
import { Ciudad } from '../../../api/models/all';

@Component({
  selector: 'app-create-oficina',
  templateUrl: './create-oficina.component.html',
  styleUrls: ['./create-oficina.component.scss']
})
export class CreateOficinaComponent implements OnInit {

  oficina: Oficina = new Oficina();
  ciudades: Observable<Ciudad[]>;
  selectedCiudad: Ciudad = new Ciudad();

  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCiudades();
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
    this.oficina.ciudad = this.selectedCiudad.id;
    console.log(this.oficina);
    this.apiService.createOficinas(this.oficina).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot save! " + error)
    );
  }

}
