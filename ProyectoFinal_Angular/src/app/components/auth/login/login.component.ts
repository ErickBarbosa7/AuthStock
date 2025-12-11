import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UiAlertService } from '../../../services/ui-alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  // Datos del formulario
  credentials = {
    email: '',
    password: ''
  };

  // Control para mostrar u ocultar la contrasena
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private uiAlert: UiAlertService
  ) {}

  // Alterna la visibilidad de la contrasena
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Accion principal para iniciar sesion
  onLogin() {

    // Validacion: campos necesarios
    if (!this.credentials.email || !this.credentials.password) {
      this.uiAlert.warning('Por favor ingresa tu correo y contrasena.');
      return;
    }

    // Mostrar loading mientras se procesa la solicitud
    this.uiAlert.showLoading('Iniciando sesion...');

    this.authService.login(this.credentials)
      .pipe(finalize(() => this.uiAlert.hideLoading())) // Se ejecuta siempre al finalizar
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta Login:', res);

          // Validacion basada en lo que devuelve tu backend PHP
          if (res && !res.error && res.token) {

            // Guardamos el token (en caso de que AuthService no lo haga)
            localStorage.setItem('token_inventario', res.token);
            
            // Mostrar mensaje de bienvenida
            this.uiAlert.success(`Bienvenido ${res.user?.nombre || ''}`);
            
            // Redireccion al inventario
            this.router.navigate(['/products']);

          } else {
            // Mensaje de error devuelto desde el backend
            this.uiAlert.error(res.msg || 'Credenciales incorrectas');
          }
        },

        error: (err) => {
          console.error(err);

          // Error 401 = credenciales invalidas
          if (err.status === 401) {
            this.uiAlert.error('Correo o contrasena incorrectos');
          } else {
            // Errores de red o servidor
            this.uiAlert.error('Error de conexion con el servidor');
          }
        }
      });
  }
}
