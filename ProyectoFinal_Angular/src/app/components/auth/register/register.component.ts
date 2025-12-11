import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UiAlertService } from '../../../services/ui-alert.service'; // Servicio para alertas y loading
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  // Datos del usuario para el registro
  user = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: ''
  };

  // Controla si se muestra la contrasena
  showPassword: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private uiAlert: UiAlertService // Servicio para mostrar mensajes y loading
  ) {}

  // Mostrar u ocultar la contrasena
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Accion principal: enviar datos al backend para registrar
  onRegister() {

    // Validacion minima antes de enviar al backend
    if (!this.user.nombre || !this.user.email || !this.user.password) {
        this.uiAlert.warning('Por favor completa los campos obligatorios.');
        return;
    }

    // Mostrar loading mientras se hace la peticion
    this.uiAlert.showLoading('Creando tu cuenta...');

    this.authService.register(this.user)
      .pipe(finalize(() => this.uiAlert.hideLoading())) // Oculta loading siempre
      .subscribe({
        next: (res: any) => {

          // Si el backend devuelve error logico (error: true)
          if (res.error) {
             this.uiAlert.error(res.msg || 'No se pudo registrar.');
          } else {

             // Registro exitoso
             this.uiAlert.success('Cuenta creada exitosamente. Por favor inicia sesion.');
             this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error(err);

          // Intentamos obtener mensaje especifico del backend, si existe
          const msg = err.error?.msg || err.error?.error || 'Error al conectar con el servidor';
          this.uiAlert.error(msg);
        }
      });
  }
}
