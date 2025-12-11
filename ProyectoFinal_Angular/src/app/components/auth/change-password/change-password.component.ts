import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationsService } from '../../../services/notifications.service';
import { UiAlertService } from '../../../services/ui-alert.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {

  // Campos para las contrasenas
  newPassword: string = '';
  confirmPassword: string = '';
  
  // Control para mostrar u ocultar las contrasenas
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private notifService: NotificationsService,
    private router: Router,
    private uiAlert: UiAlertService // Servicio de alertas custom
  ) {}

  // Alterna la visibilidad de la nueva contrasena
  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  // Alterna la visibilidad de la confirmacion
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Accion principal para cambiar la contrasena
  onChangePassword() {

    // Validacion: las contrasenas deben coincidir
    if (this.newPassword !== this.confirmPassword) {
      this.uiAlert.error('Las contrasenas no coinciden.');
      return;
    }

    // Validacion: revisar que exista un email en los datos de recuperacion
    const email = this.notifService.recoveryData.email;
    if (!email) {
      this.uiAlert.error('Error de sesion. Por favor inicia el proceso nuevamente.');
      this.router.navigate(['/recover-password']);
      return;
    }

    // Mostrar loading mientras se hace la peticion
    this.uiAlert.showLoading('Actualizando contrasena...');

    // Llamar al servicio para actualizar la contrasena
    this.authService.changePassword(email, this.newPassword).subscribe({
      next: (res) => {
        // Ocultar loading y mostrar exito
        this.uiAlert.hideLoading();
        this.uiAlert.success('Contrasena actualizada con exito');
        
        // Pequeña pausa antes de redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        // Manejo de error
        console.error(err);
        this.uiAlert.hideLoading();
        this.uiAlert.error('No se pudo actualizar la contrasena. Intentalo de nuevo.');
      }
    });
  }
}
