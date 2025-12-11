import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationsService } from '../../../services/notifications.service';
import { UiAlertService } from '../../../services/ui-alert.service'; 

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {

  // Datos necesarios para enviar el correo de recuperacion
  data = {
    email: '',
    name: ''
  };
  constructor(
    private notifService: NotificationsService,
    private router: Router,
    private uiAlert: UiAlertService
  ) {}

  // Accion principal: enviar codigo de recuperacion
  onSendCode() {

    // Mostrar loading antes de enviar la peticion
    this.uiAlert.showLoading('Enviando codigo...');

    this.notifService.sendRecoveryCode(this.data.email, this.data.name).subscribe({
      next: (res) => {
        console.log('Codigo enviado:', res);

        // Ocultar loading y mostrar mensaje de exito
        this.uiAlert.hideLoading();
        this.uiAlert.success('Codigo enviado con exito');

        // Redirigir a la pantalla para verificar el codigo
        this.router.navigate(['/verify-code']);
      },
      error: (err) => {
        console.error(err);

        // Ocultar loading y mostrar mensaje de error
        this.uiAlert.hideLoading();
        this.uiAlert.error('No se pudo enviar. Verifica tus datos.');
      }
    });
  }
}
