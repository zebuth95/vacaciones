import { Component, OnInit, HostBinding } from '@angular/core';
import { Historico } from '../../../api/models/all';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api/service/api.service';
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
  selector: 'app-historico-form',
  templateUrl: './historico-form.component.html',
  styleUrls: ['./historico-form.component.scss'],
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

export class HistoricoFormComponent implements OnInit {

  @HostBinding('class') classes = 'row';

  historico: Historico = new Historico();

  success: boolean = false;
  edit = false;
  submit = false;

  constructor(
    private apiService: ApiService,
    private activedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const params = this.activedRoute.snapshot.params;
    if (params.id) {
      this.apiService.getHistoricoSolicitud(params.id).subscribe(
        data => {
          this.historico = data;
          this.edit = true;
        },
        error => console.log(error)
      );
    }
  }

  cleanFields() {
    this.historico.solicitud = '';
    this.historico.supernumerario = '';
    this.historico.oficina = '';
    this.historico.cargo = '';
    this.historico.sup_inicio_vacaciones = '';
    this.historico.sup_fin_vacaciones = '';
  }

  postData() {
    this.historico.sup_inicio_vacaciones = moment(this.historico.sup_inicio_vacaciones).format('YYYY-MM-DD');
    this.historico.sup_fin_vacaciones = moment(this.historico.sup_fin_vacaciones).format('YYYY-MM-DD');
    this.apiService.createHistoricoSolicitud(this.historico).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot save! " + error)
    );
  }

  updateData() {
    this.historico.sup_inicio_vacaciones = moment(this.historico.sup_inicio_vacaciones).format('YYYY-MM-DD');
    this.historico.sup_fin_vacaciones = moment(this.historico.sup_fin_vacaciones).format('YYYY-MM-DD');
    //this.historico.fecha_confirmacion = moment(this.historico.fecha_confirmacion).format('YYYY-MM-DD');
    this.apiService.updateHistoricoSolicitud(this.historico.id, this.historico).subscribe(
      data => {
        this.submit = true;
      },
      error => console.log("Sorry, cannot update! " + error)
    );
  }
}
