import { Component, OnInit } from '@angular/core';
//added
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
// sweetalert2
import Swal from 'sweetalert2'

interface TokenObj {
  token: string;
}

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  dataForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
    ])
  });

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    const mrToken = this.cookieService.get('bo-token');
    if (mrToken) {
      this.router.navigate(['/']);
    }
  }

  saveForm() {
    this.apiService.recoveryPassword(this.dataForm.value).subscribe( 
      result => {
        Swal.fire({
          heightAuto: false,
          icon: 'success',
          title: 'Contraseña restaurada, ingresa a tu correo para ver tu nueva contraseña',
          showConfirmButton: false,
          timer: 4500
        })
        this.router.navigate(['/']);
      }
    )
  }
}

/*
this.apiService.recoveryPassword(this.dataForm.value).subscribe(
*/