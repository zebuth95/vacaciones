import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import swal from'sweetalert2';

interface TokenObj {
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //SweetAlert
  Alerta: string='';

  authForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  registerMode = false;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  ngOnInit() {
    const mrToken = this.cookieService.get('bo-token');
    if (mrToken) {
      this.router.navigate(['/']);
    }
  }
  saveForm() {
    if (!this.registerMode) {
      this.loginUser();
    } else {
      this.apiService.registerUser(this.authForm.value).subscribe(
        result => {
          this.loginUser();
        },
        error => console.log(error)
      );
    }
  }
  loginUser() {
    this.apiService.loginUser(this.authForm.value).subscribe(
      (result: TokenObj) => {
        this.cookieService.set('bo-token', result.token);
        this.router.navigate(['/']);
      },
      error => {
        this.Respuesta("Usuario o contraseña no valido");
        console.log(error);
      }
    );
  }

  Respuesta(mensaje){
    swal.fire({heightAuto: false,title: mensaje})
  }

}
