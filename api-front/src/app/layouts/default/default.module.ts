import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//added
import { Routes, RouterModule} from '@angular/router';
import { DefaultComponent } from './default.component';
// Componentes
import { DashboardComponent } from '../../modules/dashboard/dashboard.component';
import { SolicitudesComponent } from '../../modules/solicitud/solicitudes/solicitudes.component';
//Module
import { SharedModule } from '../../shared/shared.module';
//material
import { MaterialModule } from '../../material/material.module';
// material


@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    SolicitudesComponent
    //Contenerdor de dashboard, header, footer
    //
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MaterialModule
    //
  ]
})
export class DefaultModule { }
