import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Smart Payroll and HR Manager';
  isLoginPage: boolean = false;
  currentUser: string = 'Admin';

  constructor(private router: Router, private loginService: LoginService) {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if current route is login page
        this.isLoginPage = event.url === '/login' || event.url === '/';
        
        // Update current user if not on login page
        if (!this.isLoginPage) {
          const user = sessionStorage.getItem('currentUser');
          this.currentUser = user || 'Admin';
        }
      }
    });
  }

  ngOnInit() {
    // Initial check
    const currentUrl = this.router.url;
    this.isLoginPage = currentUrl === '/login' || currentUrl === '/';
    
    if (!this.isLoginPage) {
      const user = sessionStorage.getItem('currentUser');
      this.currentUser = user || 'Admin';
    }
  }

  // Called when a route is activated
  onActivate(event: any): void {
    // Check if the activated component is LoginComponent
    if (event && event.constructor.name === 'LoginComponent') {
      this.isLoginPage = true;
    } else {
      this.isLoginPage = false;
      // Update user when not on login page
      const user = sessionStorage.getItem('currentUser');
      this.currentUser = user || 'Admin';
    }
  }

  // Logout function
  logout(): void {
    // Call the logout method from the login service
    this.loginService.logout();
    // Navigate the user to the login page
    this.router.navigate(['/login']);
  }
}