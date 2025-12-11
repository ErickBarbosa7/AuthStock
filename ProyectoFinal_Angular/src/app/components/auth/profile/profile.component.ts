import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/header/header.component';
import { UiAlertService } from '../../../services/ui-alert.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // objeto que contiene los datos del usuario
  user: any = {
    nombre: '',
    apellidos: '',
    telefono: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,          
    private uiAlert: UiAlertService   
  ) {}

  ngOnInit() {
    // obtener usuario desde localStorage al iniciar el componente
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser); // se asegura que user.id este definido
    } else {
      // si no hay usuario, mostrar alerta y redirigir al login
      this.uiAlert.error('No hay usuario logueado');
      this.router.navigate(['/login']);
    }
  }

  // metodo para guardar cambios del perfil
  saveProfile() {
    if (!this.user.id) {
      this.uiAlert.error('Usuario invalido'); // validar que exista id
      return;
    }
    
    // llamar al servicio para actualizar el perfil
    this.authService.updateProfile(this.user).subscribe({
      next: (res: any) => {
        // alerta de exito
        this.uiAlert.success('Perfil actualizado correctamente');
        this.router.navigate(['/products']); // redirige al listado de productos

        // actualizar datos en localStorage
        localStorage.setItem('user', JSON.stringify({ ...this.user, ...res.user }));
      },
      error: (err) => {
        console.error(err);
        this.uiAlert.error('Error al actualizar perfil'); // alerta de error
      }
    });
  }

  // metodo para cancelar cambios y volver a productos
  cancel() {
    this.router.navigate(['/products']); // o la ruta que corresponda
  }
}
