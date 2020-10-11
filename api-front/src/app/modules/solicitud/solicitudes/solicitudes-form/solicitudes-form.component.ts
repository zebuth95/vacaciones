import { Component, OnInit, HostBinding } from '@angular/core';
import { Solicitud } from '../../../../api/models/all';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../../api/service/api.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';

import * as moment from 'moment';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const ISO_FORMAT = {
    parse: {
        dateInput: 'LL',
    },
    display: {
        dateInput: 'YYYY-MM-DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
  selector: 'app-solicitudes-form',
  templateUrl: './solicitudes-form.component.html',
  styleUrls: ['./solicitudes-form.component.scss'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: ISO_FORMAT},
  ],
})
export class SolicitudesFormComponent implements OnInit {

  @HostBinding('class') classes = 'row';

  solicitud: Solicitud = new Solicitud();

  success: boolean = false;
  edit = false;
  submit = false;
  error = false;

  minDate: Date;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.minDate = new Date();
  }

  ngOnInit() {
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getSolicitud(params.id).subscribe(
        data => {
          this.solicitud = data;
          this.edit = true;
        },
        error => console.log(error)
      );
    }
  }

  cleanFields() {
    this.solicitud.user = '';
    this.solicitud.fecha_inicio_vacaciones = '';
    this.solicitud.fecha_fin_vacaciones = '';
  }

  postData() {
    this.solicitud.fecha_inicio_vacaciones = moment(this.solicitud.fecha_inicio_vacaciones).format('YYYY-MM-DD');
    this.solicitud.fecha_fin_vacaciones = moment(this.solicitud.fecha_fin_vacaciones).format('YYYY-MM-DD');
    console.log(this.solicitud);
    this.apiService.createSolicitud(this.solicitud).subscribe(
      data => {
        console.log(data);
        this.submit = true;
      },
      error => {
        console.log("Sorry, cannot save! " + error);
        this.error = true;
    },
    );
  }

  updateData() {
    this.solicitud.fecha_inicio_vacaciones = moment(this.solicitud.fecha_inicio_vacaciones).format('YYYY-MM-DD');
    this.solicitud.fecha_fin_vacaciones = moment(this.solicitud.fecha_fin_vacaciones).format('YYYY-MM-DD');
    this.apiService.updateSolicitud(this.solicitud.id, this.solicitud).subscribe(
      data => {
        console.log(data);
        this.submit = true;
      },
      error => {
        console.log("Sorry, cannot update! " + error);
        this.error = true;
    },
    );
  }
}
