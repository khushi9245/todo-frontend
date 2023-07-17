import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  user: any;
  constructor(private router: Router) { }
  


    onLogout() {
      const currentUrl = this.router.url;
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('user');
        this.router.navigate(['/signin']);
      } else {
        this.router.navigateByUrl(currentUrl);
      }
    }

}
