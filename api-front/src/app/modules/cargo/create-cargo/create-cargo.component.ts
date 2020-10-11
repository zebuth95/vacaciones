import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { Cargo } from '../../../api/models/all';

interface Horario {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-cargo',
  templateUrl: './create-cargo.component.html',
  styleUrls: ['./create-cargo.component.scss']
})
export class CreateCargoComponent implements OnInit {

  cargo: Cargo = new Cargo();

  submit = false;

  horarios: Horario[] = [
    {value: 'A', viewValue: 'Lunes-Viernes'},
    {value: 'B', viewValue: 'Lunes-Sabado'}
  ]

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  postData() {
    this.apiService.createCargos(this.cargo).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot save! " + error)
    );
  }

}
