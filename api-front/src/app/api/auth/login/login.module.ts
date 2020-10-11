import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
//added
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
//Material
import { MaterialModule } from '../../../material/material.module';

const routes: Routes = [
  {path: 'auth', component: LoginComponent}
];

@NgModule({
  declarations: [LoginComponent],
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
export class LoginModule { }
