import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  login(): void {
    const isAuthenticated = this.loginService.login(this.username, this.password);
    if (isAuthenticated) {
      this.loginService.setLoggedIn(true);
      sessionStorage.setItem('currentUser', this.username);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  }
}