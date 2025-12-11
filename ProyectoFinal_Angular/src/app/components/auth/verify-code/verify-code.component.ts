import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from '../../../services/notifications.service';
import { UiAlertService } from '../../../services/ui-alert.service'; // Servicio para alertas y loading
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss' 
})
export class VerifyCodeComponent {
  
  // Codigo que escribe el usuario
  code: string = '';

  constructor(
    private notifService: NotificationsService,
    private router: Router,
    private uiAlert: UiAlertService 
  ) {}

  // Accion al presionar verificar
  onVerify() {

    // Validacion minima
    if (!this.code || this.code.trim().length === 0) {
      this.uiAlert.warning('Por favor ingresa el codigo de verificacion.');
      return;
    }

    // Recuperamos el nombre del paso anterior desde el servicio
    const name = this.notifService.recoveryData.name;

    // Si no existe, se rompio el flujo de recuperacion
    if (!name) {
      this.uiAlert.warning('La sesion del proceso expiro. Inicia nuevamente.');
      this.router.navigate(['/recover-password']);
      return;
    }

    // Mostrar loading
    this.uiAlert.showLoading('Verificando codigo...');

    this.notifService.validateCode(name, this.code)
      .pipe(finalize(() => this.uiAlert.hideLoading())) // Se oculta loading siempre
      .subscribe({
        next: (res: any) => {
          // Codigo correcto
          console.log('Codigo correcto', res);
          
          this.uiAlert.success('Codigo verificado correctamente');
          this.router.navigate(['/change-password']);
        },
        error: (err) => {
          console.error(err);

          // Error flotante
          this.uiAlert.error('El codigo es incorrecto o ha expirado.');
        }
      });
  }
}
