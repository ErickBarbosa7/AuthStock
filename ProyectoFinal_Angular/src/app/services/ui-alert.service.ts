import { Injectable } from '@angular/core';
import { Notify, Confirm, Loading } from 'notiflix';

@Injectable({
  providedIn: 'root'
})
export class UiAlertService {

  constructor() {
    // Configuración global de Notiflix Notify
    Notify.init({
      position: 'right-top',
      timeout: 2500,
      success: { background: '#4caf50' },
      failure: { background: '#f44336' },
      warning: { background: '#ff9800' },
      info: { background: '#2196f3' },
    });

    // Configuración global de Notiflix Confirm
    Confirm.init({
      titleColor: '#333',
      okButtonBackground: '#4caf50',
      cancelButtonBackground: '#f44336',
      borderRadius: '8px',
    });

    // Configuración global de Notiflix Loading
    Loading.init({
      svgSize: '80px',
      backgroundColor: 'rgba(0,0,0,0.4)',
    });
  }

  // ✅ Notificaciones rápidas
  success(message: string) {
    Notify.success(message);
  }

  error(message: string) {
    Notify.failure(message);
  }

  warning(message: string) {
    Notify.warning(message);
  }

  info(message: string) {
    Notify.info(message);
  }

  // ✅ Confirmación con modal
  confirm(message: string, onOk: () => void, onCancel?: () => void) {
    Confirm.show(
      'Confirmar acción',
      message,
      'Sí',
      'Cancelar',
      () => onOk(),
      () => onCancel && onCancel()
    );
  }
  
  showLoading(message: string = 'Cargando...') {
    Loading.circle(message);
  }

  hideLoading() {
    Loading.remove();
  }
}
