import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  // URL de tu Microservicio .NET
  private apiUrl = 'http://localhost:5184/api/Notifications';

  // Guardamos temporalmente los datos del usuario que está recuperando
  // para no pedírselos de nuevo en la siguiente pantalla
  public recoveryData = {
    email: '',
    name: ''
  };

  constructor(private http: HttpClient) { }

  //Todo se hace mediante llamadas HTTP al microservicio .NET
  // Y los codigo se mandan desde Pipedream
  // Enviar codigo de recuperacion
  sendRecoveryCode(email: string, name: string): Observable<any> {
    // Guardamos los datos en memoria para el siguiente paso
    this.recoveryData = { email, name };
    return this.http.post(`${this.apiUrl}/recover`, { email, name });
  }

  // Validar codigo de recuperacion
  validateCode(name: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, { name, code });
  }
}