import { Component, OnInit, Output, EventEmitter } from '@angular/core';
//Added
import { ApiService } from '../../api/service/api.service'; 
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  logout() {
    this.cookieService.delete('bo-token');
    this.router.navigate(['/auth']);
  }

}