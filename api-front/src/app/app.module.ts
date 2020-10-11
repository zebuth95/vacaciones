import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
//
import { DefaultModule } from './layouts/default/default.module';
import { LoginModule } from './api/auth/login/login.module';
import { RecoveryModule } from './api/auth/recovery/recovery.module';
//
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
//
import { MaterialModule } from './material/material.module';
//solicitud
import { SolicitudesFormComponent } from './modules/solicitud/solicitudes/solicitudes-form/solicitudes-form.component';
import { SolicitudesComponent } from './modules/solicitud/solicitudes/solicitudes.component';
import { SolicitudAceptadaComponent } from './modules/solicitud/solicitud-aceptada/solicitud-aceptada.component';
import { SolicitudCanceladaComponent } from './modules/solicitud/solicitud-cancelada/solicitud-cancelada.component';
//historico
import { HistoricosComponent } from './modules/historicosolicitud/historicos/historicos.component';
import { HistoricoFormComponent } from './modules/historicosolicitud/historico-form/historico-form.component';
import { EmpleadoComponent } from './modules/user/empleado/empleado.component';
import { SupernumerarioComponent } from './modules/user/supernumerario/supernumerario.component';
import { CreateEmpleadoComponent } from './modules/user/create-empleado/create-empleado.component';
import { UpdateEmpleadoComponent } from './modules/user/update-empleado/update-empleado.component';
import { CreateSupernumerarioComponent } from './modules/user/create-supernumerario/create-supernumerario.component';
import { UpdateSupernumerarioComponent } from './modules/user/update-supernumerario/update-supernumerario.component';
import { CargosComponent } from './modules/cargo/cargos/cargos.component';
import { CreateCargoComponent } from './modules/cargo/create-cargo/create-cargo.component';
import { UpdateCargoComponent } from './modules/cargo/update-cargo/update-cargo.component';
import { OficinasComponent } from './modules/oficina/oficinas/oficinas.component';
import { CreateOficinaComponent } from './modules/oficina/create-oficina/create-oficina.component';
import { UpdateOficinaComponent } from './modules/oficina/update-oficina/update-oficina.component';
import { CiudadesComponent } from './modules/ciudad/ciudades/ciudades.component';
import { CreateCiudadComponent } from './modules/ciudad/create-ciudad/create-ciudad.component';
import { UpdateCiudadComponent } from './modules/ciudad/update-ciudad/update-ciudad.component';
import { DataempleadoComponent } from './modules/profile/dataempleado/dataempleado.component';
import { DatasupernumerarioComponent } from './modules/profile/datasupernumerario/datasupernumerario.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'profile/empleado/:id',
        component: DataempleadoComponent,
      },
      {
        path: 'profile/supernumerario/:id',
        component: DatasupernumerarioComponent,
      },
      {
        path: 'ciudad',
        component: CiudadesComponent
      },
      {
        path: 'ciudad/edit/:id',
        component: UpdateCiudadComponent
      },
      {
        path: 'ciudad/add',
        component: CreateCiudadComponent
      },
      {
        path: 'cargo',
        component: CargosComponent,
      },
      {
        path: 'cargo/edit/:id',
        component: UpdateCargoComponent
      },
      {
        path: 'cargo/add',
        component: CreateCargoComponent
      },
      {
        path: 'oficina',
        component: OficinasComponent,
      },
      {
        path: 'oficina/edit/:id',
        component: UpdateOficinaComponent
      },
      {
        path: 'oficina/add',
        component: CreateOficinaComponent
      },
      //Solicitueds
      {
        path: 'solicitudes',
        component: SolicitudesComponent,
      },
      {
        path: 'solicitud_aceptada',
        component: SolicitudAceptadaComponent,
      },
      {
        path: 'solicitud_cancelada',
        component: SolicitudCanceladaComponent,
      },
      {
        path: 'solicitudes/add',
        component: SolicitudesFormComponent
      },
      {
        path: 'solicitudes/edit/:id',
        component: SolicitudesFormComponent
      },
      //Historicos
      {
        path: 'historico',
        component: HistoricosComponent
      },
      {
        path: 'historico/edit/:id',
        component: HistoricoFormComponent
      },
      {
        path: 'historico/add',
        component: HistoricoFormComponent
      },
      {
        path: 'empleado',
        component: EmpleadoComponent
      },
      {
        path: 'empleado/edit/:id',
        component: UpdateEmpleadoComponent
      },
      {
        path: 'empleado/add',
        component: CreateEmpleadoComponent
      },
      {
        path: 'supernumerario',
        component: SupernumerarioComponent
      },
      {
        path: 'supernumerario/edit/:id',
        component: UpdateSupernumerarioComponent
      },
      {
        path: 'supernumerario/add',
        component: CreateSupernumerarioComponent
      },
    ],
    },
  {path: '', pathMatch: 'full', redirectTo: 'auth'},
  {path: '', pathMatch: 'full', redirectTo: 'recovery'}
];

@NgModule({
  declarations: [
    AppComponent,
    SolicitudesFormComponent,
    SolicitudAceptadaComponent,
    SolicitudCanceladaComponent,
    HistoricosComponent,
    HistoricoFormComponent,
    EmpleadoComponent,
    SupernumerarioComponent,
    CreateEmpleadoComponent,
    UpdateEmpleadoComponent,
    CreateSupernumerarioComponent,
    UpdateSupernumerarioComponent,
    CargosComponent,
    CreateCargoComponent,
    UpdateCargoComponent,
    OficinasComponent,
    CreateOficinaComponent,
    UpdateOficinaComponent,
    CiudadesComponent,
    CreateCiudadComponent,
    UpdateCiudadComponent,
    DataempleadoComponent,
    DatasupernumerarioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    //added
    //module
    LoginModule,
    DefaultModule,
    RecoveryModule,
    //
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    RouterModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
