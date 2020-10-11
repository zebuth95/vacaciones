import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";

import { Ciudad } from '../../../api/models/all';

@Component({
  selector: 'app-update-ciudad',
  templateUrl: './update-ciudad.component.html',
  styleUrls: ['./update-ciudad.component.scss']
})
export class UpdateCiudadComponent implements OnInit {

  ciudad: Ciudad = new Ciudad();

  submit = false;

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
      this.apiService.getCiudad(params.id).subscribe(
        data => {
          this.ciudad = data;
        },
        error => console.log(error)
      );
    }
  }

  updateData() {
    this.apiService.updateCiudad(this.ciudad.id, this.ciudad).subscribe(
      data => {
        this.submit = true;
        this.loadData();
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }

}
