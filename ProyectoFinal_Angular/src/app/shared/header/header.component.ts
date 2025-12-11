import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService, private router: Router) {}

  // Cierra sesión y redirige al login
  logout() {
    this.authService.logout();
  }

  // Navega al perfil
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
