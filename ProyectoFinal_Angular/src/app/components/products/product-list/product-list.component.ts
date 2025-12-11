import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductsService, Product } from '../../../services/products.service';
import { AuthService } from '../../../services/auth.service';
import { UiAlertService } from '../../../services/ui-alert.service';

import { finalize } from 'rxjs/operators';
import { ProfileComponent } from '../../auth/profile/profile.component';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileComponent, HeaderComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = []; // arreglo de productos
  userNames: { [key: string]: string } = {}; // mapa de id de usuario a nombre completo
  selectedUser: any = null; // usuario seleccionado para ver perfil
  showProfile = false; // controla si se muestra el perfil

  currentUser: any = null; // datos del usuario logueado

  constructor(
    private productService: ProductsService,
    private authService: AuthService,
    private uiAlert: UiAlertService,
    private cdr: ChangeDetectorRef
  ) {}

  // se ejecuta al iniciar el componente
  async ngOnInit(): Promise<void> {
    const token = this.authService.getToken(); // obtiene token
    if (!token) return this.logout(); // si no hay token cierra sesion

    this.loadCurrentUser(); // carga usuario desde localstorage

    // carga usuarios primero para tener sus nombres
    await this.loadUsers();

    // luego carga productos
    this.loadProducts();
  }

  // carga usuario logueado desde localstorage
  loadCurrentUser() {
    try {
      const storedUser = localStorage.getItem('user');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      this.currentUser = null;
    }
  }

  // carga usuarios desde backend y llena userNames
  loadUsers(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.getAllUsers().subscribe({
        next: (res: any) => {
          const list = Array.isArray(res) ? res : res?.msg;
          if (Array.isArray(list)) {
            list.forEach(u => {
              this.userNames[u.id] = `${u.nombre} ${u.apellidos}`;
            });
          }
          resolve();
        },
        error: (err) => {
          console.error(err);
          resolve();
        }
      });
    });
  }

  // carga productos desde backend
  loadProducts() {
    this.uiAlert.showLoading("Cargando productos...");

    this.productService.getProducts()
      .pipe(finalize(() => this.uiAlert.hideLoading()))
      .subscribe({
        next: (data: any) => {
          if (data && !data.error && Array.isArray(data.msg)) {
            // convierte precio y stock a numero
            this.products = data.msg.map((p: any) => ({
              ...p,
              precio: Number(p.precio),
              stock: Number(p.stock)
            }));
            this.cdr.detectChanges(); // fuerza actualizacion de la vista
          }
        },
        error: err => console.error(err)
      });
  }

  // elimina producto con confirmacion
  deleteProduct(id: string) {
    this.uiAlert.confirm('¿Eliminar producto?', () => {
      this.uiAlert.showLoading("Eliminando...");

      this.productService.deleteProduct(id)
        .pipe(finalize(() => this.uiAlert.hideLoading()))
        .subscribe({
          next: () => {
            this.uiAlert.success('Producto eliminado');
            this.loadProducts(); // recarga productos
          }
        });
    });
  }

  // abre modal de perfil de usuario
  openProfile(userId: string) {
    const userFullData = this.userNames[userId]; // obtiene nombre completo
    if (!userFullData) return;

    const names = userFullData.split(' ');
    this.selectedUser = {
      id: userId,
      nombre: names[0] || '',
      apellidos: names.slice(1).join(' ') || ''
    };
    this.showProfile = true;
  }

  // cierra modal de perfil
  closeProfile() {
    this.showProfile = false;
  }

  // se ejecuta cuando se actualiza perfil
  onProfileUpdated(updatedUser: any) {
    this.currentUser = updatedUser;
    this.uiAlert.success("Perfil actualizado correctamente");
  }

  // cierra sesion
  logout() {
    this.authService.logout();
  }

  // obtiene iniciales del nombre para avatar
  getInitials(name: string): string {
    if (!name) return 'N/A';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  // verifica si el usuario logueado puede editar el producto
  canEditProduct(product: Product): boolean {
    return this.currentUser?.id === product.usuario_registro;
  }

}
