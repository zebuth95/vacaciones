import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecoveryComponent } from './recovery.component';
//added
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
//Material
import { MaterialModule } from '../../../material/material.module';

const routes: Routes = [
  {path: 'recovery', component: RecoveryComponent}
];

@NgModule({
  declarations: [RecoveryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    //Material
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CookieService
  ]
})
export class RecoveryModule { }
