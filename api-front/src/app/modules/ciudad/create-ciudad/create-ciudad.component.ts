import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { Observable, Observer } from "rxjs";
import { Ciudad } from '../../../api/models/all';

@Component({
  selector: 'app-create-ciudad',
  templateUrl: './create-ciudad.component.html',
  styleUrls: ['./create-ciudad.component.scss']
})
export class CreateCiudadComponent implements OnInit {

  ciudad: Ciudad = new Ciudad();

  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  postData() {
    this.apiService.createCiudades(this.ciudad).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot save! " + error)
    );
  }

}
