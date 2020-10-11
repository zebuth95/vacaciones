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
  selector: 'app-update-cargo',
  templateUrl: './update-cargo.component.html',
  styleUrls: ['./update-cargo.component.scss']
})
export class UpdateCargoComponent implements OnInit {

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
    this.loadData();
  }

  loadData(){
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getCargo(params.id).subscribe(
        data => {
          this.cargo = data;
        },
        error => console.log(error)
      );
    }
  }

  updateData() {
    this.apiService.updateCargo(this.cargo.id, this.cargo).subscribe(
      data => {
        this.submit = true;
        this.loadData();
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }

}
