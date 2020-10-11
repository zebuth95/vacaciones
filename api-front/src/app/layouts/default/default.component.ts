import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//added
import { ApiService } from '../../api/service/api.service'; 
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit(){
    const mrToken = this.cookieService.get('bo-token');
    if (!mrToken) {
      this.router.navigate(['/auth']);
    } 
   }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  
}
